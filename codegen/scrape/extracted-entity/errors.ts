import { Data, Either } from "effect";

type ExtractEntityErrorCode = [
  "UnexpectedValue", "NoTitle", "NoDescription", "NoColumn", "EmptyList", "NoTypes", "NoMethods",
  "TypeDefinition:StopTagEncountered",
  "TypeDefinition:TooManySteps",
  "TypeDefinition:NotFound",
  "TypeDefinition:NoSiblings",
  "Description:NotFound",
  "Description:Empty",
  "Description:TooManyReturns",
  "Description:NoReturnTypes",
  "Method:ReturnTypeNotFound"
][number]

interface ErrorDetails {
  entityName?: string,
  columnName?: "name" | "type" | "description" | "required",
  sentenceWithReturn?: string
}

export class ExtractEntityError
  extends Data.TaggedError("ExtractTypeError")<{
    error: ExtractEntityErrorCode,
    details?: ErrorDetails | undefined
  }> {

    static make(error: ExtractEntityErrorCode, details?: ErrorDetails) {
      return new ExtractEntityError({ error, details })
    }

    static left(...input: Parameters<typeof ExtractEntityError.make>) {
      return Either.left(ExtractEntityError.make(...input))
    }

  }
