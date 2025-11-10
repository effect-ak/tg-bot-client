import { Data } from "effect";

type DocPageErrorCode = "EntityNoFound"

interface ErrorDetails {
  entityName?: string,
}

export class DocPageError
  extends Data.TaggedError("DocPageError")<{
    error: DocPageErrorCode,
    details?: ErrorDetails | undefined
  }> {

  static make(error: DocPageErrorCode, details?: ErrorDetails) {
    return new DocPageError({ error, details });
  }

}
