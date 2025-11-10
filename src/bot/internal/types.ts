import type { Update } from "#/client/specification/types";
import type { BotResponse } from "./bot-response";
import type { PollSettings } from "./poll-settings";

export interface RunBotInput {
  bot_token: string
  mode: BotMode
  poll?: Partial<PollSettings>
}

export type ExtractedUpdate<K extends AvailableUpdateTypes> = { type: K } & Update[K]
export type AvailableUpdateTypes = Exclude<keyof Update, 'update_id'>

export type HandleUpdateFunction<U> =
  (update: U) => BotResponse | PromiseLike<BotResponse>

export type BotUpdatesHandlers = {
  readonly [K in AvailableUpdateTypes as `on_${K}`]?: HandleUpdateFunction<NonNullable<Update[K]>>;
};

export interface HandleBatchUpdateFunction {
  readonly on_batch: (update: Update[]) => boolean | PromiseLike<boolean>
}

export interface BotSingleMode extends BotUpdatesHandlers {
  type: "single"
}

export interface BotBatchMode extends HandleBatchUpdateFunction {
  type: "batch"
}

export type BotMode = BotSingleMode | BotBatchMode
