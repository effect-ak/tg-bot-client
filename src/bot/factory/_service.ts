import * as Micro from "effect/Micro";
import * as Context from "effect/Context";

import type { TgBotClientSettingsInput } from "#/client/guards.js";
import type { BotMessageHandlerSettings } from "#/bot/message-handler/types.js";
import { TgBotClientConfig } from "#/client/config.js";
import { makeClientConfigFrom } from "./client-config.js";
import { makeBot } from "./make-bot.js";

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
    makeBot(input).pipe(
      Micro.provideServiceEffect(TgBotClientConfig, makeClientConfigFrom(input)),
    )
}
