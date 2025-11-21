import { Data } from "effect"

import type { ExtractedMethod } from "codegen/scrape/extracted-method/_model"
import type { ExtractedType } from "codegen/scrape/extracted-type/_model"
import { extractEntities } from "./extract"
import { DocPage } from "codegen/scrape/doc-page/_model"

export interface ExtractedEntitiesShape {
  methods: ExtractedMethod[]
  types: ExtractedType[]
}

export class ExtractedEntities extends Data.TaggedClass(
  "ExtractedEntities"
)<ExtractedEntitiesShape> {
  static make(page: DocPage) {
    return extractEntities(page)
  }
}
