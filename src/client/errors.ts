import { Data } from "effect";

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
}>

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
