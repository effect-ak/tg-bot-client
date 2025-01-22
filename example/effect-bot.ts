import { BotFactoryServiceDefault } from "#/index";
import { Effect, Micro, pipe } from "effect";

Effect.gen(function* () {

  const bot = 
    yield* BotFactoryServiceDefault
      .runBot({
        type: "fromJsonFile",
        log_level: "debug",
        max_empty_responses: 3,
        on_message: (message) => {
      
          if (message.text) {
            return {
              type: "message",
              text: "hello!!!"
            }
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
