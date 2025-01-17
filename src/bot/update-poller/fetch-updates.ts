import * as Micro from "effect/Micro";

import type { BotMessageHandlers, BotResponse } from "#/bot/message-handler/types.js";
import type { State } from "./poll-and-handle.js";
import type { SafeSettings } from "./settings.js";
import { extractUpdate } from "#/bot/message-handler/utils.js";
import { execute } from "#/client/execute-request/execute.js";

type Context = {
  state: State
  settings: SafeSettings
  handlers: BotMessageHandlers
}

export const fetchUpdates = (
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

      const handler = handlers[`on_${update.type}`] as (u: typeof update) => BotResponse | undefined;

      if (!handler) {
        if (settings.update_types.includes(update.type)) {
          console.error("Handler for update not defined", update);
          hasError = true;
          break;
        } else {
          if (settings.log_level == "debug") {
            console.debug("Ignored update", update);
          }
          lastSuccessId = updateObject.update_id;
          continue;
        }
      }

      if (update.type == "message" && "text" in update) {
        console.info("Got new message", { 
          chatId: update.chat.id,
          chatType: update.chat.type,
          message: `${update.text.slice(0, 5)}...`
        })
      }

      const handleResult = handler(update);

      if ("chat" in update && handleResult) {
        const response =
          yield* execute(`send_${handleResult.type}`, {
            ...handleResult,
            chat_id: update.chat.id
          });
        if (settings.log_level == "debug" && "text") {
          console.debug("bot response", response);
        }
      }

      if (!handleResult && settings.log_level == "debug") {
        console.debug("handler returned no response for update", { update });
      };

      lastSuccessId = updateObject.update_id;

    }

    if (hasError && lastSuccessId) {
      yield* execute("get_updates", {
        offset: lastSuccessId,
        limit: 0
      });
      if (settings.log_level == "debug") {
        console.debug("committed offset", lastSuccessId)
      }
    }

    return { updates, lastSuccessId, hasError };
  });
