import { BotResponse, runTgChatBot } from "#dist/bot"
import config from "../../../config.json"

main()

async function main() {
  const bot = await runTgChatBot({
    bot_token: config.bot_token,
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
