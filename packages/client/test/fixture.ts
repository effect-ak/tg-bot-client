import { test } from "vitest"
import { Context } from "effect"

import { makeTgBotClient, TgBotClient } from "../src/client"
import { TgBotApiToken } from "../src/config"

interface Fixture {
  readonly token: string
  readonly client: TgBotClient
  readonly chat_id: string
  readonly context: Context.Context<TgBotApiToken>
}

export const fixture = test.extend<Fixture>({
  token: async (_, use) => {
    const token = process.env["bot_token"]
    if (!token) throw Error("bot_token not defined in config.json")
    use(token)
  },

  client: async ({ token }, use) => {
    const client = makeTgBotClient({
      bot_token: token
    })
    use(client)
  },
  chat_id: async (_, use) => {
    const chatId = process.env["chat_id"]
    if (!chatId) throw Error("chat_id not defined in config.json")
    use(chatId)
  },
  context: async ({ token }, use) => {
    use(Context.make(TgBotApiToken, token))
  }
})
