import * as Context from "effect/Context";
import type { BotMessageHandlers, LogLevel } from "./types";

export type BotMessageHandlerShape = Context.Tag.Service<BotMessageHandler>;

export class BotMessageHandler
  extends Context.Tag("BotMessageHandler")<BotMessageHandler, Readonly<{
    log_level?: LogLevel
    batch_size?: number
    timeout?: number
    max_empty_responses?: number
    on_error?: "stop" | "continue" 
  }> & BotMessageHandlers>() { };
