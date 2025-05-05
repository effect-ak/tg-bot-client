import * as Context from "effect/Context";
import * as Data from "effect/Data";

export type PollSettings = {
  log_level: "info" | "debug"
  on_error: "stop" | "continue"
  batch_size: number
  poll_timeout: number
  max_empty_responses: number | undefined
}

export class BotPollSettings
  extends Data.Class<PollSettings> {

  static make(input: Partial<PollSettings>) {
    let batch_size = input.batch_size ?? 10;
    let poll_timeout = input.poll_timeout ?? 10;
    let max_empty_responses = input.max_empty_responses;
    let log_level = input.log_level ?? "info";
    let on_error = input.on_error;

    if (batch_size < 10 || batch_size > 100) {
      console.warn("Wrong batch_size, must be in [10..100], using 10 instead");
      batch_size = 10;
    }

    if (poll_timeout < 2 || poll_timeout > 120) {
      console.warn("Wrong poll_timeout, must be in [2..120], using 20 instead");
      poll_timeout = 20;
    }

    if (max_empty_responses && (max_empty_responses < 2)) {
      console.warn("Wrong max_empty_responses, must be in [2..infinity], using infinity");
      max_empty_responses = undefined;
    }

    if (!log_level) {
      log_level = "info";
    }

    if (!on_error) {
      on_error = "stop";
    }

    const config = new BotPollSettings({
      batch_size, poll_timeout, max_empty_responses, log_level, on_error
    });

    console.log("bot poll settings", config);

    return config;
  }

}

export class BotPollSettingsTag
  extends Context.Reference<BotPollSettings>()(
    "BotSettings",
    {
      defaultValue() {
        return BotPollSettings.make({});
      }
    }
  ) { };