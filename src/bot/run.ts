import { Micro } from "effect";
import { BotFactoryServiceDefault } from "./factory/_service.js";

export const runTgChatBot = 
  (input: Parameters<typeof BotFactoryServiceDefault.runBot>[0]) =>
    BotFactoryServiceDefault
      .runBot(input)
      .pipe(Micro.runPromise)
      .finally(() => "Telegram chat bot has been shutdown");
