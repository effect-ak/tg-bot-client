import * as Context from "effect/Context";
import * as Data from "effect/Data";
import type { Api } from "#/client/specification/api.js";
import type { Update } from "#/client/specification/types.js";
import { PollSettings } from "./poll-settings";

export interface RunBotInput {
  bot_token: string
  mode: BotMode
  poll?: Partial<PollSettings>
}

export type ExtractedUpdate<K extends AvailableUpdateTypes> = { type: K } & Update[K]
export type AvailableUpdateTypes = Exclude<keyof Update, 'update_id'>

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

export type HandleUpdateFunction<U> =
  (update: U) => BotResponse | PromiseLike<BotResponse>

export type BotUpdatesHandlers = {
  readonly [K in AvailableUpdateTypes as `on_${K}`]?: HandleUpdateFunction<NonNullable<Update[K]>>;
};

export type HandleBatchUpdateFunction = {
  readonly on_batch: (update: Update[]) => boolean | PromiseLike<boolean>
}

export interface BotSingleMode extends BotUpdatesHandlers {
  type: "single"
}

export interface BotBatchMode extends HandleBatchUpdateFunction {
  type: "batch"
}

export type BotMode = BotSingleMode | BotBatchMode

export class BotUpdateHandlersTag
  extends Context.Tag("BotUpdateHandlers")<
    BotUpdateHandlersTag,
    BotMode
  >() { }
