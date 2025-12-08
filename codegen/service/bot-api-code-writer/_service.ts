import { Effect } from "effect"
import { TsMorpthWriter } from "#codegen-service/ts-morph-writer/_service.js"
import { writeTypes } from "./types.js"
import { writeMethods } from "./methods.js"

export class BotApiCodeWriterService extends Effect.Service<BotApiCodeWriterService>()(
  "BotApiCodeWriterService",
  {
    effect: Effect.gen(function* () {
      const { createTsFile } = yield* TsMorpthWriter

      const typeSrcFile = yield* createTsFile(
        "types",
        "client",
        "specification"
      )

      const apiSrcFile = yield* createTsFile("api", "client", "specification")

      return {
        writeTypes: writeTypes(typeSrcFile),
        writeMethods: writeMethods(apiSrcFile)
      } as const
    })
  }
) {}
