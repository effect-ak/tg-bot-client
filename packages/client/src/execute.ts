import type { Api } from "@effect-ak/tg-bot-api"

import { TgBotClientError } from "./errors"
import { isFileContent, isTgBotApiResponse } from "./guards"
import { snakeToCamel } from "./utils"
import type { TgClientConfig } from "./client"

export type ExecuteMethod = <M extends keyof Api>(
  method: M,
  input: Parameters<Api[M]>[0]
) => Promise<ReturnType<Api[M]>>

export async function executeTgBotMethod<M extends keyof Api>(
  params: {
    config: Required<TgClientConfig>
    method: M
    input: Parameters<Api[M]>[0]
  }
): Promise<ReturnType<Api[M]>> {
  const { config, method, input } = params

  let httpResponse: Response
  try {
    httpResponse = await fetch(
      `${config.base_url}/bot${config.bot_token}/${snakeToCamel(method)}`,
      {
        body: makePayload(input) ?? null,
        method: "POST"
      }
    )
  } catch (cause) {
    throw new TgBotClientError({
      cause: { _tag: "ClientInternalError", cause }
    })
  }

  let response: unknown
  try {
    response = await httpResponse.json()
  } catch {
    throw new TgBotClientError({
      cause: { _tag: "NotJsonResponse", response: httpResponse }
    })
  }

  if (!isTgBotApiResponse(response)) {
    throw new TgBotClientError({
      cause: { _tag: "UnexpectedResponse", response }
    })
  }

  if (!httpResponse.ok) {
    throw new TgBotClientError({
      cause: {
        _tag: "NotOkResponse",
        ...(response.error_code ? { errorCode: response.error_code } : {}),
        ...(response.description ? { details: response.description } : {})
      }
    })
  }

  return response.result as ReturnType<Api[M]>
}

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
