import * as Micro from "effect/Micro";

import { makeTgBotClientConfig, TgBotClientConfig } from "./config.js";
import { ClientExecuteRequestService, ClientExecuteRequestServiceDefault } from "./execute-request/_service.js";
import { ClientFileService, ClientFileServiceInterface, ClientFileServiceDefault } from "./file/_service.js";
import { Api } from "#/specification/api.js";
import type { TgBotClientSettingsInput } from "./guards.js";

export type TgBotClient = ReturnType<typeof makeTgBotClient>;

export const makeTgBotClient =
  (input: TgBotClientSettingsInput) => {

    const config = makeTgBotClientConfig(input);

    const client =
      Micro.gen(function* () {

        const execute = yield* Micro.service(ClientExecuteRequestService);
        const file = yield* Micro.service(ClientFileService);

        return {
          execute: <M extends keyof Api>(method: M, input: Parameters<Api[M]>[0]) =>
            execute.execute(method, input).pipe(Micro.runPromise),
          getFile: (input: Parameters<ClientFileServiceInterface["getFile"]>[0]) =>
            file.getFile(input).pipe(Micro.runPromise)
        }

      }).pipe(
        Micro.provideServiceEffect(ClientExecuteRequestService, ClientExecuteRequestServiceDefault),
        Micro.provideServiceEffect(ClientFileService, ClientFileServiceDefault),
        Micro.provideService(TgBotClientConfig, config),
        Micro.runSync
      );

    return client;

  }
