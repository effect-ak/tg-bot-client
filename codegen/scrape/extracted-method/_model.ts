import { Data, Either, pipe } from "effect"

import type { NormalType } from "../normal-type/_model.js"
import type { EntityFields } from "../entity-fields/_model.js"
import type { ExtractedEntityShape } from "../extracted-entity/_model.js"
import { makeFrom } from "./factory.js"

export type ExtractedMethodShape = {
  methodName: string,
  returnType: NormalType,
  methodDescription: string[],
  parameters: EntityFields | undefined
}

export class ExtractedMethod
  extends Data.TaggedClass("ExtractedMethod")<ExtractedMethodShape> {

    static makeFrom(input: ExtractedEntityShape) {
      return pipe(
        makeFrom(input),
        Either.andThen(_ => new ExtractedMethod(_))
      )
    }

  }
