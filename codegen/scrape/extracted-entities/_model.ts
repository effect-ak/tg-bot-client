import { Data } from "effect";

import type { ExtractedMethod } from "#codegen/scrape/extracted-method/_model.js";
import type { ExtractedType } from "#codegen/scrape/extracted-type/_model.js";
import { extractEntities } from "./extract.js";
import { DocPage } from "#scrape/doc-page/_model.js";

export type ExtractedEntitiesShape = {
  methods: ExtractedMethod[],
  types: ExtractedType[]
}

export class ExtractedEntities
  extends Data.TaggedClass("ExtractedEntities")<ExtractedEntitiesShape> {

    static make(page: DocPage) {
      return extractEntities(page)
    }

  }
  