import { test } from "vitest";

import { makeTgBotClient, TgBotClient } from "#/client/client.js";
import { Context } from "effect";
import { TgBotApiToken } from "#/client";

type Fixture = {
  readonly token: string
  readonly client: TgBotClient
  readonly chat_id: string
  readonly context: Context.Context<TgBotApiToken>
};

export const fixture = test.extend<Fixture>(({
  
  token: async ({}, use) => {
    const token = process.env["bot_token"];
    if (!token) throw Error("bot_token not defined in config.json");
    use(token);
  },

  client: async ({ token }, use) => {

    const client =
      makeTgBotClient({
        bot_token: token
      });
    use(client);
  },
  chat_id: async ({}, use) => {
    const chatId = process.env["chat_id"];
    if (!chatId) throw Error("chat_id not defined in config.json");
    use(chatId)
  },
  context: async ({ token}, use) => {
    use(Context.make(TgBotApiToken, token))
  }
}));
