import type { BotMessageHandlerSettings } from "#/bot/message-handler/types.js";

export type SafeSettings = ReturnType<typeof makeSettingsFrom>

export const makeSettingsFrom = (
  input: BotMessageHandlerSettings
) => {
  let limit = input.batch_size ?? 10;
  let timeout = input.timeout ?? 10;
  let max_empty_responses = input.max_empty_responses;

  if (limit < 10 || limit > 100) {
    console.warn("Wrong limit, must be in [10..100], using 10 instead");
    limit = 10;
  }

  if (timeout < 2 || timeout > 10) {
    console.warn("Wrong timeout, must be in [2..10], using 2 instead");
    limit = 10;
  }

  if (max_empty_responses && (max_empty_responses < 2)) {
    console.warn("Wrong max_empty_responses, must be in [2..infinity], using infinity");
    max_empty_responses = undefined;
  }

  return {
    limit, timeout, max_empty_responses
  } as const;
}