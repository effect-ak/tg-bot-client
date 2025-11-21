import { Data } from "effect"

import type { ExtractedType } from "codegen/scrape/extracted-type/_model"
import { ExtractedEntityShape } from "codegen/scrape/extracted-entity/_model"
import { EntityField } from "codegen/scrape/entity-fields/_model"
import { WebAppPage } from "codegen/scrape/webapp/_model"
import { extractFromPage } from "./extract"

export interface ExtractedWebAppShape {
  webapp: ExtractedEntityShape
  fields: EntityField[]
  types: ExtractedType[]
}

export class ExtractedWebApp extends Data.TaggedClass(
  "ExtractedEntities"
)<ExtractedWebAppShape> {
  static make(page: WebAppPage) {
    return extractFromPage(page)
  }
}
