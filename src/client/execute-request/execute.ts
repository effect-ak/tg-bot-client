import * as String from "effect/String";
import * as Micro from "effect/Micro";

import type { Api } from "#/client/specification/api";
import { TgBotClientError } from "#/client/errors";
import { isTgBotApiResponse } from "#/client/guards";
import { TgBotApiBaseUrl, TgBotApiToken } from "#/client/config";
import { makePayload } from "./payload";

export const executeTgBotMethod = <M extends keyof Api>(
  method: M,
  input: Parameters<Api[M]>[0]
): Micro.Micro<ReturnType<Api[M]>, TgBotClientError, TgBotApiToken> =>

  Micro.gen(function* () {

    const botToken = yield* Micro.service(TgBotApiToken);
    const baseUrl = yield* Micro.service(TgBotApiBaseUrl);

    const httpResponse =
      yield* Micro.tryPromise({
        try: () =>
          fetch(
            `${baseUrl}/bot${botToken}/${String.snakeToCamel(method)}`, {
            body: makePayload(input) ?? null,
            method: "POST",
          }),
        catch: cause =>
          new TgBotClientError({
            cause: { type: "ClientInternalError", cause }
          })
      });

    const response =
      yield* Micro.tryPromise({
        try: () => httpResponse.json(),
        catch: () =>
          new TgBotClientError({
            cause: { type: "NotJsonResponse", response: httpResponse }
          })
      });

    if (!isTgBotApiResponse(response)) {
      return yield* Micro.fail(new TgBotClientError({
        cause: { type: "UnexpectedResponse", response }
      }));
    }

    if (!httpResponse.ok) {
      return yield* Micro.fail(new TgBotClientError({
        cause: {
          type: "NotOkResponse",
          ...(response.error_code ? { errorCode: response.error_code } : undefined),
          ...(response.description ? { details: response.description } : undefined)
        }
      }));
    }

    return response.result as ReturnType<Api[M]>;

  });
