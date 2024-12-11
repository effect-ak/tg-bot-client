import type { BotConfig } from "./_client.js";
import type { Api } from "../specification/api.js";
import { makePayload } from "./request.js";
import { isTgBotApiResponse } from "./response.js";
import { TgBotClientError } from "./errors.js";

export type ExecuteRequest = ReturnType<typeof makeExecute>

type SafeExecuteResult<M extends keyof Api> = {
  success?: ReturnType<Api[M]>,
  error?: TgBotClientError
}

export const makeExecute =
  (config: BotConfig) => {

    const execute = async <M extends keyof Api>(
      method: M,
      input: Parameters<Api[M]>[0]
    ): Promise<SafeExecuteResult<M>> => {

      try {
        const httpResponse =
          await fetch(
            `${config.baseUrl}/bot${config.token}/${snakeToCamel(method)}`, {
            body: makePayload(input) ?? null,
            method: "POST",
          });

        const response = await httpResponse.json();

        if (!isTgBotApiResponse(response)) {
          return {
            error: new TgBotClientError({
              type: "UnexpectedResponse",
              response
            })
          }
        }

        if (!httpResponse.ok) {
          return {
            error: new TgBotClientError({
              type: "NotOkResponse",
              ...(response.error_code ? { errorCode: response.error_code } : undefined),
              ...(response.description ? { details: response.description } : undefined)
            })
          };
        }

        return {
          success: response.result as ReturnType<Api[M]>
        }

      } catch (cause) {
        return {
          error: new TgBotClientError({
            type: "ClientInternalError", cause
          })
        };
      }

    }

    const unsafeExecute = async <M extends keyof Api>(
      method: M,
      input: Parameters<Api[M]>[0]
    ): Promise<ReturnType<Api[M]>> => {

      const result = await execute(method, input);

      if (result.error) throw result.error

      if (!("success" in result)) throw TgBotClientError.missingSuccess;

      return result.success

    }

    return {
      execute, unsafeExecute
    } as const;

  }

const snakeToCamel =
  (methodName: string) =>
    methodName
      .split("_")
      .reduce((result, word, step) => {
        if (step == 0) {
          return word
        } else {
          return result + word.at(0)?.toUpperCase() + word.slice(1);
        }
      }, "");
