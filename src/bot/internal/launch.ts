import * as Micro from "effect/Micro";
import * as Context from "effect/Context";

import { TgBotClientConfig } from "#/client/config.js";
import { BotMode, BotUpdateHandlersTag } from "#/bot/internal/types.js";
import { BotRunService } from "#/bot/service/run.js";
import { BotPollSettings, BotPollSettingsTag } from "#/bot/internal/poll-settings.js";
import { makeClientConfigFrom, RunBotInput } from "./client-config.js";

export type BotInstance = Micro.Micro.Success<ReturnType<typeof launchBot>>

export const launchBot = (
  input: RunBotInput
) =>
  Micro.gen(function* () {

    const clientConfig =
      Context.make(TgBotClientConfig, yield* makeClientConfigFrom(input));

    const service =
      yield* Micro.service(BotRunService);

    yield* service.runBotInBackground.pipe(
      Micro.provideContext(clientConfig),
      Micro.provideService(BotUpdateHandlersTag, input.mode),
      Micro.provideService(BotPollSettingsTag, BotPollSettings.make(input.poll ?? {})),
    );

    const reload =
      (mode: BotMode) =>
        service.runBotInBackground.pipe(
          Micro.provideService(BotUpdateHandlersTag, mode),
          Micro.provideContext(clientConfig),
          Micro.runPromise
        );

    return {
      reload, fiber: service.getFiber
    } as const

  });
