import * as Data from "effect/Data";

type ErrorReason = Readonly<{
  type: "NotOkResponse"
  errorCode?: number
  details?: string
} | {
  type: "UnexpectedResponse"
  response: unknown
} | {
  type: "ClientInternalError"
  cause: unknown
} | {
  type: "UnableToGetFile"
  cause: unknown
} | {
  type: "BotHandlerError"
  cause: unknown
} | {
  type: "NotJsonResponse"
  response: unknown
}>

export class TgBotClientError
  extends Data.TaggedError("TgBotClientError")<{
    cause: ErrorReason
  }> {

  static readonly missingSuccess =
    new TgBotClientError({
      cause: {
        type: "ClientInternalError",
        cause: "Expected 'success' to be defined"
      },
    });

}
