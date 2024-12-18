import * as Micro from "effect/Micro";

import { readFileSync } from "fs";
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
        yield* Micro.try({
          try: () =>
            JSON.parse(readFileSync("config.json").toString("utf-8")),
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
