import * as Context from "effect/Context";
import * as Micro from "effect/Micro";
import type { TgBotClientError } from "#/client/errors.js";
import { BatchUpdateResult, handleUpdates } from "#/bot/internal/handle-update.js";
import { BotPollSettingsTag } from "#/bot/internal/poll-settings.js";
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

    console.log("running telegram chat bot");

    const fetchService = yield* Micro.service(BotFetchUpdatesService);
    const settings = yield* Micro.service(BotPollSettingsTag);

    const continueOnError = (hasError: boolean) => {
      if (settings.on_error == "continue") return true;
      return !hasError;
    }

    const startFiber =
      Micro.delay(1000)(
        fetchService.fetchUpdates.pipe(
          Micro.andThen(handleUpdates),
          Micro.tap(result => {
            const hasUpdates = result.updates.length > 0;
            return hasUpdates && continueOnError(result.hasErrors) ? fetchService.commit : Micro.void
          })
        )
      ).pipe(
        Micro.repeat({
          while: _ => continueOnError(_.hasErrors)
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
