import * as Context from "effect/Context";
import type { AvailableUpdateTypes, BotMessageHandlers, LogLevel } from "./types";

export type BotMessageHandlerShape = Context.Tag.Service<BotMessageHandler>;

export class BotMessageHandler
  extends Context.Tag("BotMessageHandler")<BotMessageHandler, {
    readonly log_level?: LogLevel
    readonly update_types?: AvailableUpdateTypes[]
    readonly batch_size?: number
    readonly timeout?: number
    readonly max_empty_responses?: number
  } & BotMessageHandlers>() { };
