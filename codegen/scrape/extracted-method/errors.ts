import { Data } from "effect";

import type { ExtractedEntityShape } from "#scrape/extracted-entity/_model.js";

type ExtractMethodErrorCode = [
  "NoFields", "ReturnTypeNotFound"
][number]

export class ExtractMethodError
  extends Data.TaggedError("ExtractMethodError")<{
    error: ExtractMethodErrorCode,
    entity: ExtractedEntityShape
  }> {

    static make(error: ExtractMethodErrorCode, entity: ExtractedEntityShape) {
      return new ExtractMethodError({ error, entity })
    }

  }
