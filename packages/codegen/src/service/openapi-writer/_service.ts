import { Config, Effect } from "effect"
import { dump as dumpYaml } from "js-yaml"
import { writeFile } from "fs/promises"
import * as Path from "path"

import { makeOpenApiDocument } from "./document"

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

        return Effect.tryPromise(() => writeFile(pathTo, dumpYaml(doc, {
          quotingType: '"'
        })))
      }

      return {
        writeSpecification
      }
    })
  }
) {}
