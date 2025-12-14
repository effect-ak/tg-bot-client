import { Data } from "effect"

import type { ExtractedMethod } from "~/scrape/extracted-method/_model"
import type { ExtractedType } from "~/scrape/extracted-type/_model"
import { extractEntities } from "./extract"
import { DocPage } from "~/scrape/doc-page/_model"

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
