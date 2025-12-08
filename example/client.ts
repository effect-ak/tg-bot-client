import { executeTgBotMethod, TgBotApiToken } from "#dist/index"
import { Effect } from "effect"

import config from "../config.json"

executeTgBotMethod("send_message", {
  text: "hello",
  chat_id: config.chat_id
}).pipe(
  Effect.provideService(TgBotApiToken, config.bot_token),
  Effect.runPromiseExit
)
