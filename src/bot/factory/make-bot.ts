import * as Micro from "effect/Micro";

import type { BotMessageHandlerSettings } from "#/bot/message-handler/types.js";
import { BotUpdatePollerService, BotUpdatesPollerServiceDefault } from "#/bot/update-poller/_service.js";

export const makeBot =
  (messageHandler: BotMessageHandlerSettings) =>
    Micro.gen(function* () {
      const { runBot } = yield* Micro.service(BotUpdatePollerService);
      return yield* runBot(messageHandler);
    }).pipe(
      Micro.provideServiceEffect(BotUpdatePollerService, BotUpdatesPollerServiceDefault),
      Micro.tapError(error => {
        console.error(error)
        return Micro.void;
      })
    );
