import * as Micro from "effect/Micro"
import type { BotUpdatesHandlers, RunBotInput } from "./internal/types"
import { launchBot } from "./internal/launch"

export const runTgChatBot = (input: RunBotInput) =>
  launchBot(input).pipe(Micro.runPromise)

export const defineBot = (input: BotUpdatesHandlers) => {
  if (Object.keys(input).length == 0)
    console.warn("No handlers are defined for bot")
  return input
}
