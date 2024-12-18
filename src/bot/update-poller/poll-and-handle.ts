import * as Micro from "effect/Micro";

import type { BotMessageHandlerSettings } from "#/bot/message-handler/_service.js";
import type { ClientExecuteRequestServiceInterface } from "#/client/execute-request/_service.js";

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

    for (const update of updates) {

      const res = messageHandler.onUpdate(update);

      if (!res) {
        hasError = true;

        const resp = //commit successfully handled messages
          yield* execute("get_updates", {
            offset: update.update_id,
            limit: 0
          });

        console.log(resp);

        break;
      };

      if (res) lastSuccessId = update.update_id;

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
          if (state.emptyResponses > 3) {
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
