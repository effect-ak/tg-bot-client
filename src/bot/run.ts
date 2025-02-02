import * as Micro from "effect/Micro";
import { launchBot } from "./internal/launch.js";
import { RunBotInput } from "./internal/client-config.js";

export const runTgChatBot =
  (input: RunBotInput) =>
    launchBot(input).pipe(
      Micro.runPromise
    );
