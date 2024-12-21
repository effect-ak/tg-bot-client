import * as Micro from "effect/Micro";
import { BotFactoryServiceDefault } from "./factory/_service.js";

export const runTgChatBot = 
  (input: Parameters<typeof BotFactoryServiceDefault.runBot>[0]) =>
    BotFactoryServiceDefault
      .runBot(input)
      .pipe(Micro.runPromiseExit)
