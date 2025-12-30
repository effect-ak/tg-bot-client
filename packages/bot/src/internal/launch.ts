import * as Micro from "effect/Micro"
import * as Context from "effect/Context"

import { BotRunService } from "~/service/run"
import { makeTgBotClient } from "@effect-ak/tg-bot-client"
import type { BotMode, RunBotInput } from "./types"

// Extract BotMode from flat input
const extractMode = (input: RunBotInput): BotMode => {
  if (input.mode === "batch") {
    return { type: "batch", on_batch: input.on_batch }
  }
  // single mode - collect all on_* handlers
  const { bot_token, mode, poll, ...handlers } = input
  return { type: "single", ...handlers }
}
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

    const mode = extractMode(input)

    yield* service.runBotInBackground.pipe(
      Micro.provideService(BotUpdateHandlersTag, mode),
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
