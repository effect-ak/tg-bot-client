import * as Micro from "effect/Micro";

import { makeTgBotClientConfig } from "#/client/config.js";
import { isTgBotClientSettingsInput } from "#/client/guards.js";
import type { RunBotInput } from "./_service.js";

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
            console.warn(error);
            return "ReadingConfigError";
          }
        });

      if (!isTgBotClientSettingsInput(config)) {
        return yield* Micro.fail("InvalidConfig");
      }

      return makeTgBotClientConfig(config);

    });
