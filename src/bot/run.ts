import { BotService, BotServiceDefault } from "#/bot/_service.js";
import * as Micro from "effect/Micro";
import { BotMessageHandler } from "#/bot/message-handler/_service.js";

export const runBotPromise = (
  
) =>
  Micro.gen(function* () {
    const bot = yield* Micro.service(BotService);
  }).pipe(
    Micro.provideServiceEffect(BotService, BotServiceDefault({ token: "7529626191:AAE1czY_2X5SDBGLwvpfbDoHJQC041Mxgl0" })),
    Micro.provideService(BotMessageHandler, { 
      batchWindowSize: 10,
      onUpdate: msg => {
        console.log("Got message", {
          text: msg.message?.text,
          update_id: msg.update_id
        });
        return true
      }
    }),
    Micro.tapError(error => {
      console.error(error)
      return Micro.void;
    }),
    Micro.runPromise
  ).finally(() => console.log("DONE"));


