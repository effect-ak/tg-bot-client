import * as Micro from "effect/Micro";
import * as Context from "effect/Context";

import type { TgBotClientSettingsInput } from "#/client/guards.js";
import { BotMessageHandler, type BotMessageHandlerShape } from "#/bot/message-handler/_service.js";
import { BotUpdatesPollerServiceDefault } from "#/bot/update-poller/_service.js";
import { TgBotClientConfig } from "#/client/config.js";
import { makeClientConfigFrom } from "./client-config.js";

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
  ) & BotMessageHandlerShape

export const BotFactoryServiceDefault = {
  runBot: (input: RunBotInput) =>
    Micro.gen(function* () {
 
      const client =
        Context.make(TgBotClientConfig, yield* makeClientConfigFrom(input));

      const poller =
        yield* BotUpdatesPollerServiceDefault.pipe(
          Micro.provideContext(client)
        );

      yield* poller.runBot.pipe(
        Micro.provideService(BotMessageHandler, input),
        Micro.provideContext(client),
      );

      const reload =
        (input: Partial<RunBotInput>) =>
          poller.runBot.pipe(
            Micro.provideService(BotMessageHandler, input),
            Micro.provideContext(client),
            Micro.runPromise
          );

      return {
        reload, fiber: poller.getFiber
      } as const

    })

};
