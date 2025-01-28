import * as Micro from "effect/Micro";
import * as Data from "effect/Data";

import { BotMessageHandlers, BotResponse, HandleUpdateFunction } from "#/bot/message-handler/types.js";
import type { State } from "./poll-updates.js";
import type { SafeSettings } from "./settings.js";
import { extractUpdate } from "#/bot/message-handler/utils.js";
import { execute } from "#/client/execute-request/execute.js";
import { Update } from "#/specification/types.js";
import { MESSAGE_EFFECTS } from "#/const.js";

type Context = {
  state: State
  settings: SafeSettings
  handlers: BotMessageHandlers
}

export class HandleUpdateError
  extends Data.TaggedError("HandleUpdateError")<{
    name: "UnknownUpdate" | "HandlerNotDefined" | "BotHandlerError",
    update: Update,
    cause?: unknown
  }> { }

export const fetchAndHandle = (
  { state, settings, handlers }: Context
) =>
  Micro.gen(function* () {
    const updateId = state.lastUpdateId;

    if (settings.log_level == "debug") {
      console.debug("getting updates", state);
    }

    const updates =
      yield* execute("get_updates", {
        ...settings,
        ...(updateId ? { offset: updateId } : undefined),
      }).pipe(
        Micro.andThen(_ => _.sort(_ => _.update_id))
      );

    if (updates.length) {
      console.debug(`got a batch of updates (${updates.length})`);
    }

    const lastUpdateId = updates.map(_ => _.update_id).sort().at(-1);

    if (!lastUpdateId) return { updates: [], lastUpdateId: undefined };

    const hasError =
      yield* Micro.forEach(
        updates,
        update => handleUpdate(update, settings, handlers).pipe(
          Micro.catchAll(error => {
            console.log("error", {
              updateId: update.update_id,
              updateKey: Object.keys(update).at(1),
              name: error._tag
            });
            return Micro.succeed(undefined);
          })
        ),
        {
          concurrency: 10,
        }
      ).pipe(
        Micro.andThen(batchResult => {
          if (settings.log_level == "debug") {
            console.debug("handle batch result", batchResult)
          }
          return !batchResult.every(error => error == null);
        })
      );

    if (lastUpdateId) { // next batch
      yield* execute("get_updates", {
        offset: lastUpdateId,
        limit: 0
      });
      if (settings.log_level == "debug") {
        console.debug("committed offset", lastUpdateId)
      }
    }

    return { updates, lastUpdateId, hasError };
  });

/**
 * Processes a Telegram update using the appropriate handler.
 */
const handleUpdate = (
  updateObject: Update,
  settings: SafeSettings,
  handlers: BotMessageHandlers
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

    const handler = handlers[`on_${update.type}`] as HandleUpdateFunction<typeof update>;

    if (!handler) {
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
        try: () => handler(update),
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
            updateKey: Object.keys(update).at(1),
            name: error._tag
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

    if (!handleResult && settings.log_level == "debug") {
      console.log(`Bot response is undefined for update with ID #${updateObject.update_id}.`);
      return;
    };

    if ("chat" in update && handleResult.response) {
      const response =
        yield* execute(`send_${handleResult.response.type}`, {
          ...handleResult.response,
          chat_id: update.chat.id
        });
      if (settings.log_level == "debug" && "text") {
        console.debug("bot response", response);
      }
    }

    return handleUpdateError;
  })
