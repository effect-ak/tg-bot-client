import type { Update } from "@effect-ak/tg-bot-api"
import type { BotResponse } from "./bot-response"
import type { PollSettings } from "./poll-settings"

// v3: Flat API - handlers на верхнем уровне
export type RunBotInput = RunBotInputSingle | RunBotInputBatch

export interface RunBotInputSingle extends BotUpdatesHandlers {
  bot_token: string
  mode: "single"
  poll?: Partial<PollSettings>
}

export interface RunBotInputBatch extends HandleBatchUpdateFunction {
  bot_token: string
  mode: "batch"
  poll?: Partial<PollSettings>
}

export type ExtractedUpdate<K extends AvailableUpdateTypes> = {
  type: K
} & Update[K]
export type AvailableUpdateTypes = Exclude<keyof Update, "update_id">

export type HandleUpdateFunction<U> = (
  update: U
) => BotResponse | PromiseLike<BotResponse>

// v2: Context с хелперами
export interface BotContext {
  readonly command: string | undefined
  readonly reply: (
    text: string,
    options?: Omit<BotResponseParams<"message">, "text" | "type">
  ) => BotResponse
  readonly replyWithDocument: (
    document: BotResponseParams<"document">["document"],
    options?: Omit<BotResponseParams<"document">, "document" | "type">
  ) => BotResponse
  readonly replyWithPhoto: (
    photo: BotResponseParams<"photo">["photo"],
    options?: Omit<BotResponseParams<"photo">, "photo" | "type">
  ) => BotResponse
  readonly ignore: BotResponse
}

type BotResponseParams<T extends string> = Extract<
  Parameters<typeof BotResponse.make>[0],
  { type: T }
>

// v2: Аргумент для guard handler
export interface HandlerInput<U> {
  readonly update: U
  readonly ctx: BotContext
}

// v2: Guard handler
export interface GuardedHandler<U> {
  readonly match?: (input: HandlerInput<U>) => boolean | PromiseLike<boolean>
  readonly handle: (input: HandlerInput<U>) => BotResponse | PromiseLike<BotResponse>
}

// Union для обратной совместимости
export type UpdateHandler<U> =
  | HandleUpdateFunction<U>
  | GuardedHandler<U>
  | GuardedHandler<U>[]

export type BotUpdatesHandlers = {
  [K in AvailableUpdateTypes as `on_${K}`]?: UpdateHandler<
    NonNullable<Update[K]>
  >
}

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
