import { Config, Effect } from "effect"
import { config } from "dotenv"

export const loadConfig = Effect.fn("load confug")(function* () {
  const loadResult = config()
  yield* Effect.log("load .env", loadResult)
  const token = yield* Config.nonEmptyString("TOKEN")
  const chatId = yield* Config.nonEmptyString("CHAT_ID")
  return {
    token,
    chatId
  }
})
