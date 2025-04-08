import { Data } from "effect"

import { type ExtractedEntityShape } from "#scrape/extracted-entity/_model.js"

export type ExtractedTypeShape = {
  typeName: string
  description: string[]
  type: ExtractedEntityShape["type"]
}

export class ExtractedType
  extends Data.TaggedClass("ExtractedType")<ExtractedTypeShape> {

    static makeFrom(entity: ExtractedEntityShape) {
      return new ExtractedType({
        typeName: entity.entityName,
        description: entity.entityDescription.lines,
        type: entity.type
      });
    }

  }
