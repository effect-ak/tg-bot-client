import { test } from "vitest"

import { makeTgBotClient, TgBotClient, TgClientConfig } from "~/client"

interface Fixture {
  readonly token: string
  readonly client: TgBotClient
  readonly chat_id: string
  readonly config: Required<TgClientConfig>
}

export const fixture = test.extend<Fixture>({
  token: async ({}, use) => {
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
  chat_id: async ({}, use) => {
    const chatId = process.env["chat_id"]
    if (!chatId) throw Error("chat_id not defined in config.json")
    use(chatId)
  },
  config: async ({ client }, use) => {
    use(client.config)
  }
})
