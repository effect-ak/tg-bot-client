import { Data } from "effect";

import type { ExtractedMethod } from "#codegen/scrape/extracted-method/_model.js";
import type { ExtractedType } from "../extracted-type/_model.js";
import { extractFromPage } from "./extract.js";
import { DocPage } from "../doc-page/_model.js";

export type ExtractedEntitiesShape = {
  methods: ExtractedMethod[],
  types: ExtractedType[]
}

export class ExtractedEntities
  extends Data.TaggedClass("ExtractedEntities")<ExtractedEntitiesShape> {

    static make(page: DocPage) {
      return extractFromPage(page)
    }

  }