import { Data } from "effect"

import type { NormalType } from "../normal-type/_model.js"
import type { EntityFieldShape } from "../entity-field/_model.js"
import type { ExtractedEntityShape } from "../extracted-entity/_model.js"
import { makeFrom } from "./factory.js"

export type ExtractedMethodShape = {
  methodName: string,
  returnType: NormalType,
  methodDescription: string[],
  parameters: EntityFieldShape[] | undefined
}

export class ExtractedMethod
  extends Data.TaggedClass("ExtractedMethod")<ExtractedMethodShape> {

    static makeFrom(input: ExtractedEntityShape) {
      return makeFrom(input)
    }

  }
