import * as Micro from "effect/Micro";
import { BotFactoryServiceDefault, RunBotInput } from "./factory/_service.js";
import { BotMessageHandler } from "./message-handler/_service.js";

export const runTgChatBot = 
  (input: RunBotInput) =>
    BotFactoryServiceDefault
      .runBot(input)
      .pipe(
        Micro.provideService(BotMessageHandler, input),
        Micro.runPromise
      );
