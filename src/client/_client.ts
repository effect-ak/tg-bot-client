import * as Micro from "effect/Micro";

import { makeTgBotClientConfig, TgBotClientConfig } from "./config.js";
import { ClientFileService, ClientFileServiceInterface, ClientFileServiceDefault } from "./file/_service.js";
import { Api } from "#/specification/api.js";
import type { TgBotClientSettingsInput } from "./guards.js";
import { execute } from "./execute-request/execute.js";

export type TgBotClient = ReturnType<typeof makeTgBotClient>;

export const makeTgBotClient =
  (input: TgBotClientSettingsInput) => {

    const config = makeTgBotClientConfig(input);

    const client =
      Micro.gen(function* () {

        const file = yield* Micro.service(ClientFileService);

        return {
          execute: <M extends keyof Api>(method: M, input: Parameters<Api[M]>[0]) =>
            execute(method, input).pipe(
              Micro.provideService(TgBotClientConfig, config),
              Micro.runPromise
            ),
          getFile: (input: Parameters<ClientFileServiceInterface["getFile"]>[0]) =>
            file.getFile(input).pipe(
              Micro.provideService(TgBotClientConfig, config),
              Micro.runPromise
            )
        }

      }).pipe(
        Micro.provideServiceEffect(ClientFileService, ClientFileServiceDefault),
        Micro.provideService(TgBotClientConfig, config),
        Micro.runSync
      );

    return client;

  }
