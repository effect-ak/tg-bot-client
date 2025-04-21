import * as Micro from "effect/Micro";
import { BotRunService } from "#/bot/service/run.js";
import { BotMode, BotUpdateHandlersTag, RunBotInput } from "./types.js";
import { BotPollSettings, BotPollSettingsTag } from "./poll-settings.js";
import { TgBotApiToken } from "#/client/config.js";
import { Context } from "effect";

export type BotInstance = Micro.Micro.Success<ReturnType<typeof launchBot>>

export const launchBot = (
  input: RunBotInput
) =>
  Micro.gen(function* () {

    const service =
      yield* Micro.service(BotRunService);

    const contextWithToken =
      Context.make(TgBotApiToken, input.bot_token)

    yield* service.runBotInBackground.pipe(
      Micro.provideService(BotUpdateHandlersTag, input.mode),
      Micro.provideService(BotPollSettingsTag, BotPollSettings.make(input.poll ?? {})),
      Micro.provideContext(contextWithToken)
    );

    const reload =
      (mode: BotMode) =>
        service.runBotInBackground.pipe(
          Micro.provideService(BotUpdateHandlersTag, mode),
          Micro.provideContext(contextWithToken),
          Micro.runPromise
        );

    return {
      reload, fiber: service.getFiber
    } as const

  });
