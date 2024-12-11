type ErrorReason = {
  readonly type: "NotOkResponse"
  readonly errorCode?: number
  readonly details?: string
} | {
  readonly type: "UnexpectedResponse"
  readonly response: unknown
} | {
  readonly type: "ClientInternalError"
  readonly cause: unknown
} | {
  readonly type: "UnableToGetFile"
  readonly cause: unknown
}

export class TgBotClientError extends Error {
  readonly _tag = "TgBotClientError"

  constructor(
    readonly reason: ErrorReason,
  ) {
    super()
  }

  static readonly missingSuccess = 
    new TgBotClientError({
      type: "ClientInternalError",
      cause: "Expected 'success' to be defined"
    });

}
