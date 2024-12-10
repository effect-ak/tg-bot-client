import { Data, Either } from "effect";

type ErrorShape = {
  error: [
    "Failed", "ReturnTypeSentenceNotFound", "EmptyType"
  ][number],
  details: {
    entityName?: string,
    typeName?: string
  }
}

export class NormalTypeError
  extends Data.TaggedError("NormalTypeError")<ErrorShape> {

    static make(error: ErrorShape["error"], details: ErrorShape["details"]) {
      return new NormalTypeError({ error, details })
    }

    static left(...input: Parameters<typeof NormalTypeError.make>) {
      return Either.left(NormalTypeError.make(...input))
    }

  }

