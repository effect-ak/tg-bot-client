import { test } from "vitest";

import { makeTgBotClient, TgBotClient } from "#/client/_client.js";
import { ClientExecuteRequestService, ClientExecuteRequestServiceDefault, ClientExecuteRequestServiceInterface } from "#/client/execute-request/_service.js";
import { Micro } from "effect";
import { makeTgBotClientConfig, TgBotClientConfig } from "#/client/config.js";

type Fixture = {
  readonly token: string
  readonly client: TgBotClient
  readonly chat_id: string
  readonly execute: ClientExecuteRequestServiceInterface["execute"]
};

export const fixture = test.extend<Fixture>(({
  
  token: async ({}, use) => {
    const token = process.env["bot_token"];
    if (!token) throw Error("bot_token not defined in config.json");
    use(token)
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
  execute: async ({ token }, use) => {
    const execute = 
      await Micro.service(ClientExecuteRequestService).pipe(
        Micro.provideServiceEffect(ClientExecuteRequestService, ClientExecuteRequestServiceDefault),
        Micro.provideService(TgBotClientConfig, makeTgBotClientConfig({ bot_token: token })),
        Micro.runPromise
      );

    use(execute.execute)

  }
}));
