import * as Data from "effect/Data"

type ErrorReason = Data.TaggedEnum<{
  NotOkResponse: { errorCode?: number; details?: string }
  UnexpectedResponse: { response: unknown }
  ClientInternalError: { cause: unknown }
  UnableToGetFile: { cause: unknown }
  BotHandlerError: { cause: unknown }
  NotJsonResponse: { response: unknown }
}>

export class TgBotClientError extends Data.TaggedError("TgBotClientError")<{
  cause: ErrorReason
}> {}
