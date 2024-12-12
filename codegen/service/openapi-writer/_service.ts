import { Config, Effect, Either, pipe } from "effect";
import * as TsMorph from "ts-morph"

import * as Path from "path";

export class OpenapiWriterService
  extends Effect.Service<OpenapiWriterService>()("OpenapiWriterService", {
    effect:
      Effect.gen(function* () {

        const writeToDir =
          yield* Config.array(Config.nonEmptyString(), "client-out-dir");

        

        return {}

      }) }) {}