import { Either, Array } from "effect"

import type { NormalTypeError } from "./errors.js"
import type { NormalTypeShape } from "./_model.js"
import { typeOverrides } from "./overrides.js"
import { makeNormalTypeFromPseudoTypes } from "./pseudo-type.js"
import { ExtractedEntityField } from "../types.js"
import { extractEnumFromTypeDescription } from "./enum.js"

export const makeFrom = (
  input: ExtractedEntityField
): Either.Either<NormalTypeShape, NormalTypeError> => {
  if (input.fieldName.endsWith("parse_mode")) {
    return Either.right({
      typeNames: [`"HTML" | "MarkdownV2"`],
      openApiType: {
        oneOf: [{ type: "string", enum: ["HTML", "MarkdownV2"] }]
      },
      isOverridden: true
    })
  }

  if (input.pseudoType == "String") {
    const enums = extractEnumFromTypeDescription(input.description)

    if (Array.isNonEmptyArray(enums)) {
      return Either.right({
        typeNames: Array.map(enums, (_) => `"${_}"`),
        openApiType: {
          type: "string",
          enum: enums
        }
      })
    }
  }

  const override = typeOverrides[input.entityName]?.[input.fieldName]

  if (override) {
    return Either.right({ ...override, isOverridden: true })
  }

  return makeNormalTypeFromPseudoTypes(input.pseudoType)
}
