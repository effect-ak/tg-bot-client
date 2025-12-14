import { Data, Either } from "effect"

import type { HtmlElement } from "~/types"
import type { NormalType, NormalTypeShape } from "~/scrape/normal-type/_model"
import type { EntityFields } from "~/scrape/entity-fields/_model"
import { extractFromNode } from "./factory"

export interface ExtractedEntityShape {
  entityName: string
  entityDescription: {
    lines: string[]
    returns: NormalTypeShape | undefined
  }
  type: NormalType | EntityFields
  groupName?: string
}

export class ExtractedEntity extends Data.TaggedClass(
  "ExtractedEntity"
)<ExtractedEntityShape> {
  static makeFrom(node: HtmlElement) {
    return extractFromNode(node).pipe(
      Either.andThen((_) => new ExtractedEntity(_))
    )
  }
}
