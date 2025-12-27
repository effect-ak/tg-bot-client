type ErrorReason =
  | { _tag: "NotOkResponse"; errorCode?: number; details?: string }
  | { _tag: "UnexpectedResponse"; response: unknown }
  | { _tag: "ClientInternalError"; cause: unknown }
  | { _tag: "UnableToGetFile"; cause: unknown }
  | { _tag: "BotHandlerError"; cause: unknown }
  | { _tag: "NotJsonResponse"; response: unknown }

export class TgBotClientError extends Error {
  readonly _tag = "TgBotClientError"
  readonly cause: ErrorReason

  constructor(options: { cause: ErrorReason }) {
    super(`TgBotClientError: ${options.cause._tag}`)
    this.cause = options.cause
    this.name = "TgBotClientError"
  }
}
