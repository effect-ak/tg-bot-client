import { Config, Effect } from "effect";

import { writeFile } from "fs/promises"
import { makeOpenApiDocument } from "./document.js";
import * as Path from "path";

export class OpenapiWriterService
  extends Effect.Service<OpenapiWriterService>()("OpenapiWriterService", {
    effect:
      Effect.gen(function* () {

        const writeToDir =
          yield* Config.array(Config.nonEmptyString(), "client-out-dir");

        const writeSpecification =
          (...input: Parameters<typeof makeOpenApiDocument>) => {

            const doc = makeOpenApiDocument(...input);

            const pathTo = Path.join(...writeToDir, "openapi.json");

            return Effect.tryPromise(() => 
              writeFile(pathTo, JSON.stringify(doc, undefined, 2))
            );

          }

        return {
          writeSpecification
        }

      })
  }) { }