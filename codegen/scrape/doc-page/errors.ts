import { Data } from "effect";

type DocPageErrorCode = [
  "EntityNoFound"
][number];

type ErrorDetails = {
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
