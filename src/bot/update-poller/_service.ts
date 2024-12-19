import * as Micro from "effect/Micro";
import * as Context from "effect/Context";

import { ClientExecuteRequestService, ClientExecuteRequestServiceDefault } from "#/client/execute-request/_service.js";
import { BotMessageHandlerSettings } from "#/bot/message-handler/types.js";
import { pollAndHandle } from "./poll-and-handle.js";

export type BotUpdatePollerServiceInterface =
  Micro.Micro.Success<typeof BotUpdatesPollerServiceDefault>;

export class BotUpdatePollerService
  extends Context.Tag("BotUpdatePollerService")<BotUpdatePollerService, BotUpdatePollerServiceInterface>() { };

export const BotUpdatesPollerServiceDefault =
  Micro.gen(function* () {

    const state = {
      isActive: false,
    }

    const client = yield* Micro.service(ClientExecuteRequestService);

    const runBot = (
      messageHandler: BotMessageHandlerSettings
    ) =>
      Micro.gen(function* () {
        if (state.isActive) {
          return yield* Micro.fail("AlreadyRunning");
        }

        const fiber =
          yield* pollAndHandle({
            settings: messageHandler,
            execute: client.execute
          }).pipe(Micro.forkDaemon);

        fiber.addObserver((exit) => {
          console.log("bot's fiber has been closed", exit);
          state.isActive = false;
        });

        console.log("Reading bot's updates...");

        return fiber;

      });

    return {
      runBot
    } as const;

  }).pipe(
    Micro.provideServiceEffect(ClientExecuteRequestService, ClientExecuteRequestServiceDefault)
  );
