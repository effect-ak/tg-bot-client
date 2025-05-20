import * as Micro from "effect/Micro";

import { ClientFileService, ClientFileServiceDefault } from "./file/_service.js";
import type { Api } from "#/client/specification/api.js";
import { executeTgBotMethod } from "./execute-request/execute.js";
import { TgBotApiToken } from "./config.js";
import { GetFile } from "./file/get-file.js";

export interface TgBotClient {
  readonly execute: <M extends keyof Api>(method: M, input: Parameters<Api[M]>[0]) => Promise<ReturnType<Api[M]>>
  readonly getFile: (input: GetFile) => Promise<File>
}

type MakeTgClient = {
  bot_token: string
}

export function makeTgBotClient(config: MakeTgClient): TgBotClient {

  const client =
    Micro.gen(function* () {

      const file = yield* Micro.service(ClientFileService);

      const execute =
        <M extends keyof Api>(method: M, input: Parameters<Api[M]>[0]) =>
          executeTgBotMethod(method, input).pipe(
            Micro.provideService(TgBotApiToken, config.bot_token),
            Micro.runPromise
          );

      const getFile =
        (input: GetFile) =>
          file.getFile(input).pipe(
            Micro.provideService(TgBotApiToken, config.bot_token),
            Micro.runPromise
          );

      return {
        execute,
        getFile
      }

    }).pipe(
      Micro.provideServiceEffect(ClientFileService, ClientFileServiceDefault),
      Micro.runSync
    );

  return client;

}
