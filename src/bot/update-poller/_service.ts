import * as Micro from "effect/Micro";
import * as Context from "effect/Context";

import { ClientExecuteRequestService, ClientExecuteRequestServiceDefault } from "#/client/execute-request/_service.js";
import type { BotMessageHandlerSettings } from "#/bot/message-handler/types.js";
import type { TgBotClientError } from "#/client/errors.js";
import { pollAndHandle } from "./poll-and-handle.js";

export type BotUpdatePollerServiceInterface =
  Micro.Micro.Success<typeof BotUpdatesPollerServiceDefault>;

export class BotUpdatePollerService
  extends Context.Tag("BotUpdatePollerService")<BotUpdatePollerService, BotUpdatePollerServiceInterface>() { };

export const BotUpdatesPollerServiceDefault =
  Micro.gen(function* () {

    console.log("Initiating BotUpdatesPollerServiceDefault")

    const state = {
      fiber: undefined as Micro.MicroFiber<unknown, TgBotClientError> | undefined
    }

    const client = yield* Micro.service(ClientExecuteRequestService);

    const runBot = (
      messageHandler: BotMessageHandlerSettings
    ) =>
      Micro.gen(function* () {

        console.log(state)

        const startFiber =
          pollAndHandle({
            settings: messageHandler,
            execute: client.execute
          }).pipe(
            Micro.forkDaemon,
            Micro.tap(fiber =>
              fiber.addObserver((exit) => {
                console.log("bot's fiber has been closed", exit);
                if (messageHandler.onExit) {
                  messageHandler.onExit(exit)
                }
              })
            )
          );

        if (state.fiber) {
          console.log("killing previous bot's fiber")
          yield* Micro.fiberInterrupt(state.fiber);
        }

        state.fiber = yield* startFiber;

        console.log("Reading bot's updates.....", state.fiber == null);

        return state.fiber;

      });

    return {
      runBot
    } as const;

  }).pipe(
    Micro.provideServiceEffect(ClientExecuteRequestService, ClientExecuteRequestServiceDefault)
  );
