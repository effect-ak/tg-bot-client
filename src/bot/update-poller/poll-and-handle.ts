import * as Micro from "effect/Micro";

import type { ClientExecuteRequestServiceInterface } from "#/client/execute-request/_service.js";
import type { BotMessageHandlerSettings, BotResponse } from "#/bot/message-handler/types.js";
import { extractUpdate } from "../message-handler/utils.js";

export const handleUntilFirstHandlerError = (
  messageHandler: BotMessageHandlerSettings,
  execute: ClientExecuteRequestServiceInterface["execute"]
) => {

  const state = {
    lastUpdateId: undefined as number | undefined,
    emptyResponses: 0
  };

  return Micro.gen(function* () {
    const updateId = state.lastUpdateId;

    console.info("getting updates", { updateId })
    const updates =
      yield* execute("get_updates", {
        limit: 10,
        timeout: 10,
        ...(updateId ? { offset: updateId } : undefined)
      }).pipe(
        Micro.andThen(_ => _.sort(_ => _.update_id))
      );

    let lastSuccessId = undefined as number | undefined;
    let hasError = false;

    for (const updateObject of updates) {

      const update = extractUpdate(updateObject);

      if (!update) {
        console.warn("Unknown update", update);
        hasError = true;
        break;
      }

      const handler = messageHandler[`on_${update.type}`] as (u: typeof update) => BotResponse;;

      if (!handler) {
        console.warn("Handler for update not defined", update);
        hasError = true;
        break;
      }

      const handleResult = handler(update);

      if ("chat" in update) {
        const response =
          yield* execute(`send_${handleResult.type}`, {
            ...handleResult,
            chat_id: update.chat.id
          });
        console.log("bot response", response);
      }

      if (!handleResult) {
        hasError = true;

        console.log(handleResult);

        break;
      };

      lastSuccessId = updateObject.update_id;

    }

    if (hasError && lastSuccessId) {
      const resp = //commit successfully handled messages
        yield* execute("get_updates", {
          offset: lastSuccessId,
          limit: 0
        });
    }

    return { updates, lastSuccessId, hasError };
  }).pipe(
    Micro.repeat({
      while: ({ updates, lastSuccessId, hasError }) => {

        if (hasError) {
          console.warn("error in handler, quitting");
          return false;
        }

        if (updates.length == 0) {
          state.emptyResponses += 1;
          if (state.emptyResponses > 200) {
            console.info("too many empty responses, quitting");
            return false;
          }
        } else {
          state.emptyResponses = 0;
        };

        if (lastSuccessId) {
          state.lastUpdateId = lastSuccessId + 1;
        }

        return true;
      }
    }),
    Micro.andThen(Micro.sleep(2000))
  )
}
