import { Config, Effect } from "effect"

import { dump as dumpYaml } from "js-yaml"
import { writeFile } from "fs/promises"
import { makeOpenApiDocument } from "./document"
import * as Path from "path"

export class OpenapiWriterService extends Effect.Service<OpenapiWriterService>()(
  "OpenapiWriterService",
  {
    effect: Effect.gen(function* () {
      const writeToDir = yield* Config.array(
        Config.nonEmptyString(),
        "openapi-out-dir"
      )

      const writeSpecification = (
        ...input: Parameters<typeof makeOpenApiDocument>
      ) => {
        const doc = makeOpenApiDocument(...input)

        const pathTo = Path.join(...writeToDir, "openapi.yaml")

        return Effect.tryPromise(() => writeFile(pathTo, dumpYaml(doc)))
      }

      return {
        writeSpecification
      }
    })
  }
) {}
