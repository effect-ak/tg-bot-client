import { executeTgBotMethod, TgBotApiToken } from "@effect-ak/tg-bot-client"
import { Effect } from "effect"
import { loadConfig } from "./config"

await Effect.gen(function* () {
  const config = yield* loadConfig()
  const chatId = config.chatId
  yield* executeTgBotMethod("send_message", {
    text: `hello, ${chatId}`,
    chat_id: chatId
  }).pipe(Effect.provideService(TgBotApiToken, config.token))
}).pipe(Effect.tapErrorCause(Effect.logError), Effect.runPromiseExit)
