import { makeTgBotClient } from "@effect-ak/tg-bot-client"
import { runTgChatBot } from "@effect-ak/tg-bot"
import { loadConfig } from "../config"
import { Effect } from "effect"

const config = await loadConfig().pipe(Effect.runPromise)

const tgClient = makeTgBotClient({
  bot_token: config.token
})

runTgChatBot({
  bot_token: config.token,
  poll: {
    log_level: "debug",
    batch_size: 100,
    on_error: "stop",
    poll_timeout: 60
  },
  mode: {
    type: "batch",
    on_batch: async (updates) => {
      console.log("got many updates!", updates.length)

      const messages = updates.map((_) => _.message).filter((_) => _ != null)

      await tgClient.execute("send_message", {
        chat_id: config.chatId,
        text: `I got ${messages.length} messages`
      })

      return true
    }
  }
})
