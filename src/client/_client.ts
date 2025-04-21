import * as Micro from "effect/Micro";

import { ClientFileService, ClientFileServiceInterface, ClientFileServiceDefault } from "./file/_service.js";
import type { Api } from "#/client/specification/api.js";
import { execute } from "./execute-request/execute.js";
import { TgBotApiToken } from "./config.js";

export type TgBotClient = ReturnType<typeof makeTgBotClient>;

type MakeTgClient = {
  bot_token: string
}

export const makeTgBotClient = ({
  bot_token
}: MakeTgClient) => {

    const client =
      Micro.gen(function* () {

        const file = yield* Micro.service(ClientFileService);

        return {
          execute: <M extends keyof Api>(method: M, input: Parameters<Api[M]>[0]) =>
            execute(method, input).pipe(
              Micro.provideService(TgBotApiToken, bot_token),
              Micro.runPromise
            ),
          getFile: (input: Parameters<ClientFileServiceInterface["getFile"]>[0]) =>
            file.getFile(input).pipe(
              Micro.provideService(TgBotApiToken, bot_token),
              Micro.runPromise
            )
        }

      }).pipe(
        Micro.provideServiceEffect(ClientFileService, ClientFileServiceDefault),
        Micro.provideService(TgBotApiToken, bot_token),
        Micro.runSync
      );

    return client;

  }
