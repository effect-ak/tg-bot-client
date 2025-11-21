import { Config, Effect, Either, pipe } from "effect"
import * as Path from "path"
import * as TsMorph from "ts-morph"

export class TsMorpthWriter extends Effect.Service<TsMorpthWriter>()(
  "TsMorpthWriter",
  {
    scoped: Effect.gen(function* () {
      const writeToDir = yield* Config.array(
        Config.nonEmptyString(),
        "scrapper-out-dir"
      )

      console.log("Initializing TsMorphWriter")

      yield* Effect.addFinalizer(() => Effect.logInfo("Closing TsMorpthWriter"))

      const project = new TsMorph.Project({
        manipulationSettings: {
          indentationText: TsMorph.IndentationText.TwoSpaces
        }
      })

      const saveFiles = pipe(
        Effect.tryPromise(() => project.save()),
        Effect.andThen((result) =>
          Effect.logInfo("Morph project closed", result)
        )
      )

      const createTsFile = (name: string, ...dir: string[]) =>
        Either.try(() => {
          const to = Path.join(...writeToDir, ...dir, name + ".ts")
          console.log("Creating morph source file", to)
          return project.createSourceFile(to, "", { overwrite: true })
        })

      return { createTsFile, saveFiles }
    }),
    dependencies: []
  }
) {}
