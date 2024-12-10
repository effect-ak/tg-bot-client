import { Data } from "effect";

import type { ExtractedMethodShape } from "#codegen/scrape/extracted-method/_model.js";
import type { ExtractedTypeShape } from "../extracted-type/_model.js";
import { extractFromPage } from "./extract.js";
import { DocPage } from "../doc-page/_model.js";

export type ExtractedEntitiesShape = {
  methods: ExtractedMethodShape[],
  types: ExtractedTypeShape[]
}

export class ExtractedEntities
  extends Data.TaggedClass("ExtractedEntities")<ExtractedEntitiesShape> {

    static make(page: DocPage) {
      return extractFromPage(page)
    }

  }