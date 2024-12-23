import type { Api } from "#/specification/api.js";
import type { Update } from "#/specification/types.js";
import type { PollAndHandleResult } from "#/bot/update-poller/poll-and-handle";
import type * as Micro from "effect/Micro";
import type { TgBotClientError } from "#/client/errors";

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
  readonly batch_size?: number
  readonly timeout?: number
  readonly max_empty_responses?: number
} & BotMessageHandlers & {
  onExit?: (_: Micro.MicroExit<PollAndHandleResult, TgBotClientError>) => void 
}