import { Effect } from "effect"
import { TsMorpthWriter } from "~/service/ts-morph-writer/_service"
import { writeTypes } from "./types"
import { writeMethods } from "./methods"

export class BotApiCodeWriterService extends Effect.Service<BotApiCodeWriterService>()(
  "BotApiCodeWriterService",
  {
    effect: Effect.gen(function* () {
      const { createTsFile } = yield* TsMorpthWriter

      const typeSrcFile = yield* createTsFile("types", "src", "specification")

      const apiSrcFile = yield* createTsFile("api", "src", "specification")

      return {
        writeTypes: writeTypes(typeSrcFile),
        writeMethods: writeMethods(apiSrcFile)
      } as const
    })
  }
) {}
