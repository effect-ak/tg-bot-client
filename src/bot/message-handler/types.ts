import type { Api } from "#/specification/api.js";
import type { Update } from "#/specification/types.js";

export type AvailableUpdateTypes = Exclude<keyof Update, 'update_id'>;

export type BotResponse = {
  [K in keyof Api]: K extends `send_${infer R}`
    ? { type: Lowercase<R> } & Omit<Parameters<Api[K]>[0], 'chat_id'>
    : never
}[keyof Api];

export type BotMessageHandlers = {
  [K in AvailableUpdateTypes as `on_${K}`]?: (update: NonNullable<Update[K]>) => BotResponse;
};

export type BotMessageHandlerSettings = {
  readonly batch_size?: number,
  readonly timeout?: number,
  readonly max_empty_responses?: number,
} & BotMessageHandlers