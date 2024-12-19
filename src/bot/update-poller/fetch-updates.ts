import * as Micro from "effect/Micro";

import { extractUpdate } from "#/bot/message-handler/utils.js";

import type { State } from "./poll-and-handle.js";
import type { SafeSettings } from "./settings.js";
import type { BotMessageHandlers, BotResponse } from "../message-handler/types.js";
import type { ClientExecuteRequestServiceInterface } from "#/client/execute-request/_service.js";

type Context = {
  state: State,
  settings: SafeSettings,
  handlers: BotMessageHandlers,
  execute: ClientExecuteRequestServiceInterface["execute"]
}

export const fetchUpdates = (
  { state, settings, execute, handlers}: Context
) =>
  Micro.gen(function* () {
    const updateId = state.lastUpdateId;

    console.info("getting updates", state);
    const updates =
      yield* execute("get_updates", {
        ...settings,
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

      const handler = handlers[`on_${update.type}`] as (u: typeof update) => BotResponse;

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
  })