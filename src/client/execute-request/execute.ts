import * as Micro from "effect/Micro";
import * as String from "effect/String";

import type { Api } from "#/specification/api.js";

import { TgBotClientError } from "../errors.js";
import { TgBotClientConfig } from "../config.js";
import { makePayload } from "./payload.js";
import { isTgBotApiResponse } from "../guards.js";

export const execute = <M extends keyof Api>(
  method: M,
  input: Parameters<Api[M]>[0]
): Micro.Micro<ReturnType<Api[M]>, TgBotClientError, TgBotClientConfig> =>

  Micro.gen(function* () {

    const config = yield* Micro.service(TgBotClientConfig);

    const httpResponse =
      yield* Micro.tryPromise({
        try: () =>
          fetch(
            `${config.base_url}/bot${config.bot_token}/${String.snakeToCamel(method)}`, {
            body: makePayload(input) ?? null,
            method: "POST",
          }),
        catch: cause =>
          new TgBotClientError({
            reason: { type: "ClientInternalError", cause }
          })
      });

    const response =
      yield* Micro.tryPromise({
        try: () => httpResponse.json(),
        catch: () =>
          new TgBotClientError({
            reason: { type: "UnexpectedResponse", response: httpResponse }
          })
      });

    if (!isTgBotApiResponse(response)) {
      return yield* Micro.fail(new TgBotClientError({
        reason: { type: "UnexpectedResponse", response }
      }));
    }

    if (!httpResponse.ok) {
      return yield* Micro.fail(new TgBotClientError({
        reason: {
          type: "NotOkResponse",
          ...(response.error_code ? { errorCode: response.error_code } : undefined),
          ...(response.description ? { details: response.description } : undefined)
        }
      }));
    }

    return response.result as ReturnType<Api[M]>;

  });
