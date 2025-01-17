import * as Micro from "effect/Micro";

import type { BotMessageHandlerSettings } from "#/bot/message-handler/types.js";
import { BotUpdatePollerService } from "#/bot/update-poller/_service.js";

export const makeBot =
  (messageHandler: BotMessageHandlerSettings) =>
    Micro.gen(function* () {
      const { runBot } = yield* Micro.service(BotUpdatePollerService);
      const fiber = yield* runBot(messageHandler);
      const interrupt =
        Micro.fiberInterrupt(fiber);

      return {
        runBot, interrupt
      };
    }).pipe(
      Micro.tapError(error => {
        console.error(error)
        return Micro.void;
      })
    );
