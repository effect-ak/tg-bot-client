import * as Micro from "effect/Micro"
import * as Context from "effect/Context"

import { BotRunService } from "~/service/run"
import { makeTgBotClient } from "@effect-ak/tg-bot-client"
import type { BotMode, RunBotInput } from "./types"
import {
  BotPollSettings,
  BotPollSettingsTag,
  BotUpdateHandlersTag,
  BotTgClientTag
} from "./poll-settings"

export type BotInstance = Micro.Micro.Success<ReturnType<typeof launchBot>>

export const launchBot = (input: RunBotInput) =>
  Micro.gen(function* () {
    const service = yield* Micro.service(BotRunService)

    const client = makeTgBotClient({ bot_token: input.bot_token })
    const contextWithClient = Context.make(BotTgClientTag, client)

    yield* service.runBotInBackground.pipe(
      Micro.provideService(BotUpdateHandlersTag, input.mode),
      Micro.provideService(
        BotPollSettingsTag,
        BotPollSettings.make(input.poll ?? {})
      ),
      Micro.provideContext(contextWithClient)
    )

    const reload = (mode: BotMode) =>
      service.runBotInBackground.pipe(
        Micro.provideService(BotUpdateHandlersTag, mode),
        Micro.provideContext(contextWithClient),
        Micro.runPromise
      )

    return {
      reload,
      fiber: service.getFiber
    } as const
  })
