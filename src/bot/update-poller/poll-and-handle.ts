import * as Micro from "effect/Micro";

import type { ClientExecuteRequestServiceInterface } from "#/client/execute-request/_service.js";
import type { BotMessageHandlerSettings } from "#/bot/message-handler/types.js";
import { makeSettingsFrom } from "./settings.js";
import { fetchUpdates } from "./fetch-updates.js";

export type State = {
  lastUpdateId: number | undefined
  emptyResponses: number
}

export type PollAndHandleInput = {
  settings: BotMessageHandlerSettings
  execute: ClientExecuteRequestServiceInterface["execute"]
}

export const pollAndHandle = (
  input: PollAndHandleInput
) => {

  const state: State = {
    lastUpdateId: undefined,
    emptyResponses: 0
  };

  const settings = makeSettingsFrom(input.settings);

  return fetchUpdates({
    state, settings,
    execute: input.execute,
    handlers: input.settings,
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
