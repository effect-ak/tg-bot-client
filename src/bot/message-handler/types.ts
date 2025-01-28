import { TaggedClass } from "effect/Data";

import type { Api } from "#/specification/api.js";
import type { Update } from "#/specification/types.js";

export type AvailableUpdateTypes = Exclude<keyof Update, 'update_id'>
export type LogLevel = "info" | "debug";

type BotResult = {
  [K in keyof Api]: K extends `send_${infer R}`
    ? { type: R } & Omit<Parameters<Api[K]>[0], 'chat_id'>
    : never
}[keyof Api];

export class BotResponse extends TaggedClass("BotResponse")<{
  readonly response?: BotResult
}> {
  static make(result: BotResult): BotResponse {
    return new BotResponse({ response: result })
  }

  static readonly ignore = new BotResponse({})
}

export type HandleUpdateFunction<U> =
  (update: U) => BotResponse | PromiseLike<BotResponse>

type MessageHandlers = {
  readonly [K in AvailableUpdateTypes as `on_${K}`]?: HandleUpdateFunction<NonNullable<Update[K]>>;
};

export interface BotMessageHandlers extends MessageHandlers {}
