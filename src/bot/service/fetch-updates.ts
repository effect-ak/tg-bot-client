import * as Context from "effect/Context";
import * as Data from "effect/Data";
import * as Micro from "effect/Micro";
import { BotPollSettingsTag } from "#/bot/internal/poll-settings";
import { executeTgBotMethod } from "#/client/execute";

interface State {
  lastUpdateId: number | undefined
  emptyResponses: number
}

export class BotFetchUpdatesService
  extends Context.Reference<BotFetchUpdatesService>()(
    "BotFetchUpdatesService",
    {
      defaultValue: () => {

        const state: State = {
          lastUpdateId: undefined,
          emptyResponses: 0
        };

        const fetchUpdates =
          _fetchUpdates(state).pipe(
            Micro.tap(updates => {
              const id = updates.map(_ => _.update_id).sort().at(-1);
              console.log("updating last update id", id);
              state.lastUpdateId = id ? id + 1 : undefined;
              console.log(state);
            })
          );

        const commit = _commitLastBatch(state);

        return {
          state, fetchUpdates, commit
        } as const;
      }
    }
  ) { }

export class FetchUpdatesError
  extends Data.TaggedError("FetchUpdatesError")<{
    name: "TooManyEmptyResponses" | "NoUpdatesToCommit"
  }> { }

const _fetchUpdates = (
  pollState: State
) =>
  Micro.gen(function* () {

    const pollSettings = yield* Micro.service(BotPollSettingsTag);

    if (pollSettings.max_empty_responses && pollState.emptyResponses == pollSettings.max_empty_responses) {
      return yield* Micro.fail(
        new FetchUpdatesError({ name: "TooManyEmptyResponses" })
      )
    }

    const updateId = pollState.lastUpdateId;

    if (pollSettings.log_level == "debug") {
      console.debug("getting updates", pollState);
    }

    const updates =
      yield* executeTgBotMethod("get_updates", {
        timeout: pollSettings.poll_timeout,
        ...(updateId ? { offset: updateId } : undefined),
      }).pipe(
        Micro.andThen(_ => _.sort(_ => _.update_id))
      );

    if (updates.length) {
      console.debug(`got a batch of updates (${updates.length})`);
      pollState.emptyResponses = 0;
      return updates;
    } else {
      pollState.emptyResponses += 1;
      return [];
    }

  });

const _commitLastBatch = (
  pollState: State
) =>
  Micro.gen(function* () {

    console.log("commit", { pollState })
    if (pollState.lastUpdateId) { // next batch
      return yield* executeTgBotMethod("get_updates", {
        offset: pollState.lastUpdateId,
        limit: 0
      }).pipe(
        Micro.andThen(
          Micro.andThen(Micro.service(BotPollSettingsTag), pollSettings => {
            if (pollSettings.log_level == "debug") {
              console.debug("committed offset", pollState)
            }
          })
        )
      );
    } else {
      return yield* Micro.fail(new FetchUpdatesError({
        name: "NoUpdatesToCommit"
      }))
    }

  });
