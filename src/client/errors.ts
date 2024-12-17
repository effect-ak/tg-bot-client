import * as Data from "effect/Data";

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

export class TgBotClientError
  extends Data.TaggedError("TgBotClientError")<{
    reason: ErrorReason
  }> {

  static readonly missingSuccess =
    new TgBotClientError({
      reason: {
        type: "ClientInternalError",
        cause: "Expected 'success' to be defined"
      },
    });

}
