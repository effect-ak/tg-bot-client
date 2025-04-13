import { Micro, Context } from "effect";
import type { TgBotClientError } from "#/client/errors.js";
import { BatchUpdateResult, handleUpdates } from "#/bot/internal/handle-update.js";
import { BotFetchUpdatesService, FetchUpdatesError } from "./fetch-updates.js";

type State = {
  fiber: Micro.MicroFiber<BatchUpdateResult, TgBotClientError | FetchUpdatesError> | undefined
}

export class BotRunService
  extends Context.Reference<BotRunService>()(
    "BotRunService",
    {
      defaultValue: () => {

        console.log("Initiating BotRunService");

        const state: State = {
          fiber: undefined
        };

        const runBotInBackground = _runBotDaemon(state);
        const getFiber = () => state.fiber;

        return {
          runBotInBackground,
          getFiber
        } as const;

      }
    }) { };

const _runBotDaemon = (
  state: State
) =>
  Micro.gen(function* () {

    console.log("run bot");

    const fetchService = yield* Micro.service(BotFetchUpdatesService);

    const startFiber =
      Micro.delay(1000)(
        fetchService.fetchUpdates.pipe(
          Micro.andThen(updates =>
            handleUpdates(updates)
          ),
          Micro.tap(({ updates }) =>
            updates.length > 0 ? fetchService.commit : Micro.void
          )
        )
      ).pipe(
        Micro.repeat({
          while: _ => !_.hasErrors
        }),
        Micro.forkDaemon,
        Micro.tap(fiber =>
          fiber.addObserver((exit) => {
            console.log("bot's fiber has been closed", exit);
          })
        )
      );

    if (state.fiber) {
      console.log("killing previous bot's fiber")
      yield* Micro.fiberInterrupt(state.fiber);
    }

    state.fiber = yield* startFiber;

    console.log("Fetching bot updates via long polling...");

  });
