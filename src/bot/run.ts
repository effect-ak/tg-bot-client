import * as Micro from "effect/Micro";
import { BotFactoryServiceDefault, RunBotInput } from "./factory/_service.js";

export const runTgChatBot = 
  (input: RunBotInput) =>
    BotFactoryServiceDefault
      .runBot(input)
      .pipe(Micro.runPromise)
