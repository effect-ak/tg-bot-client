import { BotResponse, runTgChatBot } from "@effect-ak/tg-bot"
import { Effect } from "effect"

import { loadConfig } from "../config"

main()

async function main() {
  const config = await loadConfig().pipe(Effect.runPromise)
  const bot = await runTgChatBot({
    bot_token: config.token,
    mode: {
      type: "single",
      on_message: (msg) => {
        if (!msg.text) return BotResponse.ignore

        return BotResponse.make({
          type: "message",
          text: "hey :)"
        })
      }
    }
  })

  setTimeout(() => {
    console.log("time to reload")
    bot.reload({
      type: "single",
      on_message: (msg) => {
        if (!msg.text) return BotResponse.ignore

        return BotResponse.make({
          type: "message",
          text: "reloaded hey :)"
        })
      }
    })
  }, 5000)
}
