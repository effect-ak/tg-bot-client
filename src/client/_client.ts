import * as Micro from "effect/Micro";

import { ClientFileService, ClientFileServiceDefault } from "./file/_service.js";
import type { Api } from "#/client/specification/api.js";
import { executeTgBotMethod } from "./execute-request/execute.js";
import { TgBotApiToken } from "./config.js";
import { GetFile } from "./file/get-file.js";

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
            executeTgBotMethod(method, input).pipe(
              Micro.provideService(TgBotApiToken, bot_token),
              Micro.runPromise
            ),
          getFile: (input: GetFile) =>
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
