import { test } from "vitest";

import { makeTgBotClient, TgBotClient } from "#/client/_client.js";
import { ExecuteRequestService, ExecuteRequestServiceDefault, ExecuteRequestServiceInterface } from "#/client/execute-request/_service.js";
import { Micro } from "effect";
import { makeTgBotClientConfig, TgBotClientConfig } from "#/client/config.js";

type Fixture = {
  readonly token: string
  readonly client: TgBotClient
  readonly chat_id: string
  readonly execute: ExecuteRequestServiceInterface["execute"]
};

export const fixture = test.extend<Fixture>(({
  
  token: async ({}, use) => {
    const token = process.env["bot-token"];
    if (!token) throw Error("bot-token not defined in config.json");
    use(token)
  },

  client: async ({ token }, use) => {

    const client =
      makeTgBotClient({
        token
      });
    use(client);
  },
  chat_id: async ({}, use) => {
    const chatId = process.env["chat-id"];
    if (!chatId) throw Error("chat-id not defined in config.json");
    use(chatId)
  },
  execute: async ({ token }, use) => {
    const execute = 
      await Micro.service(ExecuteRequestService).pipe(
        Micro.provideServiceEffect(ExecuteRequestService, ExecuteRequestServiceDefault),
        Micro.provideService(TgBotClientConfig, makeTgBotClientConfig({ token })),
        Micro.runPromise
      );

    use(execute.execute)

  }
}));
