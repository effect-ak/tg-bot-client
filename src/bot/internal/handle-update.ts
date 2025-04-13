import { Micro, Data } from "effect";
import { BotUpdateHandlersTag, BotResponse, HandleUpdateFunction, BotUpdatesHandlers, HandleBatchUpdateFunction } from "#/bot/internal/types.js";
import { extractUpdate } from "#/bot/internal/utils.js";
import { execute } from "#/client/execute-request/execute.js";
import { Update } from "#/client/specification/types.js";
import { MESSAGE_EFFECTS } from "#/const.js";
import { BotPollSettingsTag, PollSettings } from "./poll-settings.js";

export class BatchUpdateResult
  extends Data.Class<{
    hasErrors: boolean,
    updates: Update[]
  }> { };

export const handleUpdates = (
  updates: Update[],
) =>
  Micro.gen(function* () {

    const pollSettings = yield* Micro.service(BotPollSettingsTag);
    const updateHandler = yield* Micro.service(BotUpdateHandlersTag);

    if (updateHandler.type == "single") {
      return yield* handleOneByOne(updates, updateHandler, pollSettings);
    } else {
      return yield* handleEntireBatch(updates, updateHandler)
    }

  });

export const handleEntireBatch = (
  updates: Update[],
  handlers: HandleBatchUpdateFunction,
) =>
  Micro.try({
    try: () => handlers.on_batch(updates),
    catch: _ => _
  }).pipe(
    Micro.andThen(result => {
      if (result instanceof Promise) {
        return Micro.tryPromise({
          try: () => result,
          catch: _ => _
        })
      } else {
        return Micro.succeed(result as boolean)
      }
    }),
    Micro.andThen(doNext =>
      new BatchUpdateResult({
        hasErrors: !doNext,
        updates
      })
    ),
    Micro.catchAll(error => {
      console.log("handle batch error", {
        errorMessage: (error instanceof Error) ? error.message : undefined,
        updates: updates.map(_ => Object.keys(_).at(1))
      });
      return Micro.succeed(
        new BatchUpdateResult({
          hasErrors: true, updates
        })
      )
    })
  );

export class HandleUpdateError
  extends Data.TaggedError("HandleUpdateError")<{
    name: "UnknownUpdate" | "HandlerNotDefined" | "BotHandlerError",
    update: Update,
    cause?: unknown
  }> { }

export const handleOneByOne = (
  updates: Update[],
  handlers: BotUpdatesHandlers,
  pollSettings: PollSettings
) =>
  Micro.forEach(
    updates,
    update =>
      handleOneUpdate(update, handlers).pipe(
        Micro.catchAll(error => {
          console.log("update handle error", {
            updateId: update.update_id,
            updateKey: Object.keys(update).at(1),
            name: error._tag,
            ...(error.cause instanceof Error ? { error: error.cause.message } : undefined)
          });
          return Micro.succeed(error);
        })
      ),
    {
      concurrency: 10,
    }
  ).pipe(
    Micro.andThen(batchResult => {
      if (pollSettings.log_level == "debug") {
        console.debug("handle batch result", batchResult)
      }
      return new BatchUpdateResult({
        hasErrors: !batchResult.every(error => error == null),
        updates
      })
    })
  );
/**
 * Processes a Telegram update using the appropriate handler.
 */
export const handleOneUpdate = (
  updateObject: Update,
  handlers: BotUpdatesHandlers
) =>
  Micro.gen(function* () {

    const update = extractUpdate(updateObject);

    if (!update) {
      return yield* Micro.fail(
        new HandleUpdateError({
          name: "UnknownUpdate",
          update: updateObject
        })
      );
    }

    const updateHandler = handlers[`on_${update.type}`] as HandleUpdateFunction<typeof update>;

    if (!updateHandler) {
      return yield* Micro.fail(
        new HandleUpdateError({
          name: "HandlerNotDefined",
          update: updateObject
        })
      )
    }

    if (update.type == "message" && "text" in update) {
      console.info("Got a new text message", {
        chatId: update.chat.id,
        chatType: update.chat.type,
        message: `${update.text.slice(0, 5)}...`
      })
    }

    let handleUpdateError: HandleUpdateError | undefined;

    const handleResult =
      yield* Micro.try({
        try: () => updateHandler(update),
        catch: error =>
          new HandleUpdateError({
            name: "BotHandlerError",
            update: updateObject,
            cause: error
          })
      }).pipe(
        Micro.andThen(handleResult => {
          if (handleResult instanceof Promise) { // extract promise
            return Micro.tryPromise({
              try: () => handleResult as Promise<BotResponse>,
              catch: error =>
                new HandleUpdateError({
                  name: "BotHandlerError",
                  update: updateObject,
                  cause: error,
                })
            })
          }
          return Micro.succeed(handleResult as BotResponse);
        }),
        Micro.catchAll(error => {
          handleUpdateError = error;
          console.log("error", {
            updateId: updateObject.update_id,
            updateKey: Object.keys(updateObject).at(1),
            name: error._tag,
            ...(error.cause instanceof Error ? { error: error.cause.message } : undefined)
          });
          return Micro.succeed(
            BotResponse.make({
              type: "message",
              text: `Some internal error has happend(${error.name}) while handling this message`,
              message_effect_id: MESSAGE_EFFECTS["💩"],
              ...(updateObject.message?.message_id ? {
                reply_parameters: {
                  message_id: updateObject.message?.message_id,
                }
              } : undefined)
            })
          )
        })
      );

    const pollSettings = yield* Micro.service(BotPollSettingsTag);

    if (!handleResult && pollSettings.log_level == "debug") {
      console.log(`Bot response is undefined for update with ID #${updateObject.update_id}.`);
      return;
    };

    if ("chat" in update && handleResult.response) {
      const response =
        yield* execute(`send_${handleResult.response.type}`, {
          ...handleResult.response,
          chat_id: update.chat.id
        });
      if (pollSettings.log_level == "debug" && "text") {
        console.debug("bot response", response);
      }
    }

    return handleUpdateError;
  });
