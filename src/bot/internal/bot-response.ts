import * as Data from "effect/Data";
import type { Api } from "#/client/specification/api";

type BotResult = {
  [K in keyof Api]: K extends `send_${infer R}`
  ? { type: R } & Omit<Parameters<Api[K]>[0], 'chat_id'>
  : never
}[keyof Api];

export class BotResponse
  extends Data.TaggedClass("BotResponse")<{
    response?: BotResult
  }> {

  static make(result: BotResult): BotResponse {
    return new BotResponse({ response: result })
  }

  static readonly ignore = new BotResponse({})
}