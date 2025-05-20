import * as Micro from "effect/Micro";
import * as Context from "effect/Context";

import { ClientFileService, ClientFileServiceDefault } from "./file/_service";
import type { Api } from "#/client/specification/api";
import { executeTgBotMethod } from "./execute-request/execute";
import { TgBotApiToken } from "./config";
import { GetFile } from "./file/get-file";

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
      const context = Context.make(TgBotApiToken, config.bot_token);

      const execute =
        <M extends keyof Api>(method: M, input: Parameters<Api[M]>[0]) =>
          executeTgBotMethod(method, input).pipe(
            Micro.provideContext(context),
            Micro.runPromise
          );

      const getFile =
        (input: GetFile) =>
          file.getFile(input).pipe(
            Micro.provideContext(context),
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
