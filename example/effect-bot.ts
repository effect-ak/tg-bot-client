import { Effect, Micro, pipe } from "effect";

import { BotResponse, launchBot } from "#/index";

Effect.gen(function* () {

  const bot = 
    yield* launchBot({
        type: "fromJsonFile",
        poll: {
          log_level: "debug",
          max_empty_responses: 3,
        },
        mode: {
          type: "single",
          on_message: (message) => {
      
            if (!message.text) return BotResponse.ignore;
  
            return BotResponse.make({
              type: "message",
              text: "hello!!!"
            })
        
          }
        }
      });

  yield* pipe(
    Micro.fiberAwait(bot.fiber()!),
    Effect.andThen(Effect.logInfo("done")),
    Effect.forkDaemon
  );

}).pipe(
  Effect.runPromise
);
