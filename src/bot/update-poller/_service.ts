import * as Micro from "effect/Micro";
import * as Context from "effect/Context";

import type { TgBotClientError } from "#/client/errors.js";
import { BotMessageHandler } from "#/bot/message-handler/_service.js";
import { pollAndHandle } from "./poll-and-handle.js";

export type BotUpdatePollerServiceInterface =
  Micro.Micro.Success<typeof BotUpdatesPollerServiceDefault>;

export class BotUpdatePollerService
  extends Context.Tag("BotUpdatePollerService")<BotUpdatePollerService, BotUpdatePollerServiceInterface>() { };

export const BotUpdatesPollerServiceDefault =
  Micro.gen(function* () {

    console.log("Initiating BotUpdatesPollerServiceDefault");

    const state = {
      fiber: undefined as Micro.MicroFiber<unknown, TgBotClientError> | undefined
    };

    const runBot =
      Micro.gen(function* () {

        console.log("run bot")

        const messageHandler = yield* Micro.service(BotMessageHandler);

        const startFiber =
          pollAndHandle({
            settings: messageHandler,
          }).pipe(
            Micro.forkDaemon,
            Micro.tap(fiber =>
              fiber.addObserver((exit) => {
                console.log("bot's fiber has been closed", exit);
                // if (messageHandler.onExit) {
                //   messageHandler.onExit(exit)
                // }
              })
            )
          );

        if (state.fiber) {
          console.log("killing previous bot's fiber")
          yield* Micro.fiberInterrupt(state.fiber);
        }

        state.fiber = yield* startFiber;

        console.log("Fetching bot updates via long polling...");

      });

    return {
      runBot, getFiber: () => state.fiber
    } as const;

  });

