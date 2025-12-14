import * as String from "effect/String"
import * as Micro from "effect/Micro"
import type { Api } from "@effect-ak/tg-bot-api"

import { TgBotClientError } from "./errors"
import { isFileContent, isTgBotApiResponse } from "./guards"
import { TgBotApiBaseUrl, TgBotApiToken } from "./config"

export const executeTgBotMethod = <M extends keyof Api>(
  method: M,
  input: Parameters<Api[M]>[0]
): Micro.Micro<ReturnType<Api[M]>, TgBotClientError, TgBotApiToken> =>
  Micro.gen(function* () {
    const botToken = yield* Micro.service(TgBotApiToken)
    const baseUrl = yield* Micro.service(TgBotApiBaseUrl)

    const httpResponse = yield* Micro.tryPromise({
      try: () =>
        fetch(`${baseUrl}/bot${botToken}/${String.snakeToCamel(method)}`, {
          body: makePayload(input) ?? null,
          method: "POST"
        }),
      catch: (cause) =>
        new TgBotClientError({
          cause: { _tag: "ClientInternalError", cause }
        })
    })

    const response = yield* Micro.tryPromise({
      try: () => httpResponse.json(),
      catch: () =>
        new TgBotClientError({
          cause: { _tag: "NotJsonResponse", response: httpResponse }
        })
    })

    if (!isTgBotApiResponse(response)) {
      return yield* Micro.fail(
        new TgBotClientError({
          cause: { _tag: "UnexpectedResponse", response }
        })
      )
    }

    if (!httpResponse.ok) {
      return yield* Micro.fail(
        new TgBotClientError({
          cause: {
            _tag: "NotOkResponse",
            ...(response.error_code
              ? { errorCode: response.error_code }
              : undefined),
            ...(response.description
              ? { details: response.description }
              : undefined)
          }
        })
      )
    }

    return response.result as ReturnType<Api[M]>
  })

export const makePayload = (body: object): FormData | undefined => {
  const entries = Object.entries(body)

  if (entries.length == 0) return undefined

  const result = new FormData()

  for (const [key, value] of entries) {
    if (!value) continue

    if (typeof value != "object") {
      result.append(key, `${value}`)
    } else if (isFileContent(value)) {
      result.append(key, new Blob([value.file_content]), value.file_name)
    } else {
      result.append(key, JSON.stringify(value))
    }
  }

  return result
}
