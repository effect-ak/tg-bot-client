import { Data, Either, pipe } from "effect"

import type { NormalType } from "../normal-type/_model"
import type { EntityFields } from "../entity-fields/_model"
import type { ExtractedEntityShape } from "../extracted-entity/_model"
import { makeFrom } from "./factory"

export interface ExtractedMethodShape {
  methodName: string
  returnType: NormalType
  methodDescription: string[]
  parameters: EntityFields | undefined
  groupName?: string
}

export class ExtractedMethod extends Data.TaggedClass(
  "ExtractedMethod"
)<ExtractedMethodShape> {
  static makeFrom(input: ExtractedEntityShape) {
    return pipe(
      makeFrom(input),
      Either.andThen((_) => new ExtractedMethod(_))
    )
  }
}
