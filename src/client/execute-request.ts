import type { BotConfig } from "./_client.js";
import type { Api } from "../specification/api.js";
import { makePayload } from "./request.js";
import { isTgBotApiResponse, TgBotApiResponse } from "./response.js";

export type ExecuteRequest = ReturnType<typeof makeExecute>

export const makeExecute =
  (config: BotConfig) => {

    const execute = async <M extends keyof Api>(
      method: M,
      input: Parameters<Api[M]>[0]
    ): Promise<TgBotApiResponse<ReturnType<Api[M]>>> => {

      const httpResponse =
        await fetch(
          `${config.baseUrl}/bot${config.token}/${snakeToCamel(method)}`, {
          body: makePayload(input) ?? null,
          method: "POST"
        }).then(_ => _.json() as Promise<Record<string, unknown>>);

      if (!isTgBotApiResponse<ReturnType<Api[M]>>(httpResponse))
        throw new Error("Not valid response", {
          cause: httpResponse
        });

      if (httpResponse.ok == false) {
        console.warn(httpResponse)
      }

      return httpResponse;

    }

    return execute;

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
