import { Micro } from "effect";
import { makeTgBotClientConfig } from "#/client/config.js";
import { isTgBotClientSettingsInput } from "#/client/guards.js";
import type { TgBotClientSettingsInput } from "#/client/guards.js";
import type { BotMode } from "#/bot/internal/types";
import type { PollSettings } from "#/bot/internal/poll-settings";

export interface RunBotInputBase {
  mode: BotMode
  poll?: Partial<PollSettings>
}

export interface RunBotInputFromJsonFile extends RunBotInputBase {
  type: "fromJsonFile"
}

export interface RunBotInputConfig extends RunBotInputBase, TgBotClientSettingsInput {
  type: "config"
}

export type RunBotInput = RunBotInputFromJsonFile | RunBotInputConfig;

export const makeClientConfigFrom =
  (input: RunBotInput) =>
    Micro.gen(function* () {

      if (input.type == "config") {
        return makeTgBotClientConfig(input)
      }

      const config =
        yield* Micro.tryPromise({
          try: async () => {
            const { readFileSync } = await import("fs");
            return JSON.parse(await readFileSync("config.json", "utf-8"))
          },
          catch: error => {
            console.warn("invalid tg bot config", error);
            return "ReadingConfigError";
          }
        });

      if (!isTgBotClientSettingsInput(config)) {
        return yield* Micro.fail("InvalidConfig");
      }

      return makeTgBotClientConfig(config);

    });
