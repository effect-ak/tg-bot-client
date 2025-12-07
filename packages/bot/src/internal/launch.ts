import * as Micro from "effect/Micro"
import * as Context from "effect/Context"

import { BotRunService } from "~/service/run"
import { TgBotApiToken } from "@effect-ak/tg-bot-client"
import type { BotMode, RunBotInput } from "./types"
import {
  BotPollSettings,
  BotPollSettingsTag,
  BotUpdateHandlersTag
} from "./poll-settings"

export type BotInstance = Micro.Micro.Success<ReturnType<typeof launchBot>>

export const launchBot = (input: RunBotInput) =>
  Micro.gen(function* () {
    const service = yield* Micro.service(BotRunService)

    const contextWithToken = Context.make(TgBotApiToken, input.bot_token)

    yield* service.runBotInBackground.pipe(
      Micro.provideService(BotUpdateHandlersTag, input.mode),
      Micro.provideService(
        BotPollSettingsTag,
        BotPollSettings.make(input.poll ?? {})
      ),
      Micro.provideContext(contextWithToken)
    )

    const reload = (mode: BotMode) =>
      service.runBotInBackground.pipe(
        Micro.provideService(BotUpdateHandlersTag, mode),
        Micro.provideContext(contextWithToken),
        Micro.runPromise
      )

    return {
      reload,
      fiber: service.getFiber
    } as const
  })
