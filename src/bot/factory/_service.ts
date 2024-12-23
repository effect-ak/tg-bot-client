import * as Micro from "effect/Micro";
import * as Context from "effect/Context";

import type { TgBotClientSettingsInput } from "#/client/guards.js";
import type { BotMessageHandlerSettings } from "#/bot/message-handler/types.js";
import { BotUpdatePollerService, BotUpdatesPollerServiceDefault } from "#/bot/update-poller/_service.js";
import { TgBotClientConfig } from "#/client/config.js";
import { makeClientConfigFrom } from "./client-config.js";
import { makeBot } from "./make-bot.js";

export type BotInstance = 
  Micro.Micro.Success<ReturnType<typeof BotFactoryServiceDefault["runBot"]>>

export class BotFactoryService
  extends Context.Tag("BotFactoryService")<BotFactoryService, typeof BotFactoryServiceDefault>() { };

export type RunBotInput =
  (
    {
      type: "fromJsonFile"
    } | {
      type: "config",
    } & TgBotClientSettingsInput
  ) & BotMessageHandlerSettings

export const BotFactoryServiceDefault = {
  makeBot,
  runBot: (input: RunBotInput) =>
    Micro.gen(function* () {
      console.log("client")

      const client = yield* makeClientConfigFrom(input);

      const poller =
        yield* BotUpdatesPollerServiceDefault.pipe(
          Micro.provideService(TgBotClientConfig, client),
        );

      const bot =
        yield* makeBot(input).pipe(
          Micro.provideService(BotUpdatePollerService, poller),
        );

      const reload =
        (input: Partial<RunBotInput>) =>
          bot.runBot(input).pipe(Micro.runPromise);

      return {
        reload
      } as const

    })

}
