import { makeTgBotClient } from "@effect-ak/tg-bot-client"
import { loadConfig } from "./config"

async function main() {
  try {
    const config = loadConfig()
    const chatId = config.chatId

    const client = makeTgBotClient({
      bot_token: config.token
    })

    await client.execute("send_message", {
      text: `hello, ${chatId}`,
      chat_id: chatId
    })

    console.log("Message sent successfully!")
  } catch (error) {
    console.error("Error:", error)
    process.exit(1)
  }
}

main()
