import * as Micro from "effect/Micro";

import type { BotMessageHandlerShape } from "#/bot/message-handler/_service.js";
import { makeSettingsFrom } from "./settings.js";
import { fetchAndHandle } from "./fetch-and-handle.js";

export type State = {
  lastUpdateId: number | undefined
  emptyResponses: number
}

export type PollAndHandleInput = {
  settings: BotMessageHandlerShape
}

export type PollAndHandleResult = 
  Micro.Micro.Success<ReturnType<typeof pollUpdates>>

export const pollUpdates = (
  input: PollAndHandleInput
) => {

  const state: State = {
    lastUpdateId: undefined,
    emptyResponses: 0
  };

  const settings = makeSettingsFrom(input.settings);

  return Micro.delay(1000)(
    fetchAndHandle({
      state, settings,
      handlers: input.settings,
    })
  ).pipe(
    Micro.repeat({
      while: ({ updates, lastUpdateId, hasError }) => {

        if (hasError === true && settings.on_error == "stop") {
          console.info("Could not handle some messages, quitting");
          return false;
        }

        if (updates.length == 0) {
          state.emptyResponses += 1;
          if (settings.max_empty_responses && state.emptyResponses > settings.max_empty_responses) {
            console.info("too many empty responses, quitting");
            return false;
          }
        } else {
          state.emptyResponses = 0;
        };

        if (lastUpdateId) {
          state.lastUpdateId = lastUpdateId + 1;
        }

        return true;
      }
    })
  )
}
