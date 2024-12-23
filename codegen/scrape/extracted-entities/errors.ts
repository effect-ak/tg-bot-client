import { Data } from "effect";

type ErrorCode = [
  "NodesNotFound", "GroupNameNotDefined"
][number];

export class ExtractedEntitiesError
  extends Data.TaggedError("NodesNotFound")<{
    error: ErrorCode
  }> {

  static make(error: ErrorCode) {
    return new ExtractedEntitiesError({ error });
  }

}
