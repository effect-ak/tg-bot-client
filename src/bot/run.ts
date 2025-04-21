import * as Micro from "effect/Micro";
import type { BotUpdatesHandlers, RunBotInput } from "./internal/types.js";
import { launchBot } from "./internal/launch.js";

export const runTgChatBot =
  (input: RunBotInput) =>
    launchBot(input).pipe(
      Micro.runPromise
    );

export const defineBot =
  (input: BotUpdatesHandlers) => {
    if (Object.keys(input).length == 0) console.warn("No handlers are defined for bot");
    return input;
  }
