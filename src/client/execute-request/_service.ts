import * as Micro from "effect/Micro";
import * as Context from "effect/Context";

import type { Api } from "#/specification/api.js";

import { TgBotClientError } from "../errors.js";
import { TgBotClientConfig } from "../config.js";
import { execute } from "./execute.js";

export type ClientExecuteRequestServiceInterface =
  Micro.Micro.Success<typeof ClientExecuteRequestServiceDefault>

export class ClientExecuteRequestService
  extends Context.Tag("ClientExecuteRequestService")<
    ClientExecuteRequestService, {
      execute: <M extends keyof Api>(
        method: M,
        input: Parameters<Api[M]>[0]
      ) => Micro.Micro<ReturnType<Api[M]>, TgBotClientError>
    }>() { }

export const ClientExecuteRequestServiceDefault =
  Micro.gen(function* () {

    const config = yield* Micro.service(TgBotClientConfig);

    return {
      execute: <M extends keyof Api>(
        method: M,
        input: Parameters<Api[M]>[0]
      ) => execute(config, method, input)
    } as const;

  })


