import type { Api } from "../specification/api.js";
import { makePayload, methodPath } from "./request.js";
import { isTgBotApiResponse, TgBotApiResponse } from "./response.js";

const defaultBaseUrl = "https://api.telegram.org";

export type TgBotClient = ReturnType<typeof makeTgBotClient>

export const makeTgBotClient =
  (options: {
    token: string,
    baseUrl?: string
  }) => {

    const baseUrl = options.baseUrl ?? defaultBaseUrl;

    const execute = async <M extends keyof Api>(
      method: M,
      input: Parameters<Api[M]>[0]
    ): Promise<TgBotApiResponse<ReturnType<Api[M]>>> => {

      const httpResponse =
        await fetch(
          `${baseUrl}/bot${options.token}/${methodPath(method)}`, {
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

    return {
      execute
    } as const;

  }
