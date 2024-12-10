import { Data, Either } from "effect"

import type { HtmlElement } from "#codegen/types.js"
import { NormalType, NormalTypeShape } from "#scrape/normal-type/_model.js"
import type { EntityField } from "#scrape/entity-field/_model.js"
import { extractFromNode } from "./factory.js"

export type ExtractedEntityShape = {
  entityName: string,
  entityDescription: {
    lines: string[],
    returns: NormalTypeShape | undefined
  },
  type: {
    type: "normalType",
    normalType: NormalType
  } | {
    type: "fields",
    fields: EntityField[]
  }
}

export class ExtractedEntity
  extends Data.TaggedClass("ExtractedEntity")<ExtractedEntityShape> {

    static makeFrom(node: HtmlElement) {
      return extractFromNode(node).pipe(Either.andThen(_ => new ExtractedEntity(_)))
    }

  }