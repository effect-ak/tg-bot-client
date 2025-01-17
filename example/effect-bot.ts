import { BotFactoryServiceDefault } from "#/index";
import { Effect } from "effect";

Effect.gen(function* () {

  const bot = 
    yield* BotFactoryServiceDefault
      .runBot({
        type: "fromJsonFile",
        on_message: (message) => {
      
          if (message.text) {
            return {
              type: "message",
              text: "hello!!!"
            }
          }
      
        }
      });

  yield* Effect.sleep("5 seconds").pipe(
    Effect.andThen(bot.bot.interrupt),
    Effect.forkDaemon
  );

}).pipe(
  Effect.runPromise
);
