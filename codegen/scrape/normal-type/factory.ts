import { Either } from "effect";

import type { NormalTypeError } from "./errors.js";
import type { NormalTypeShape } from "./_model.js";
import { typeOverrides } from "./overrides.js";
import { makeNormalTypeFromPseudoTypes } from "./pseudo-type.js";

export const makeFrom =
  (input: {
    entityName: string,
    fieldName: string,
    pseudoType: string
  }): Either.Either<NormalTypeShape, NormalTypeError> => {
    const override = typeOverrides[input.entityName]?.[input.fieldName];

    if (override) return Either.right({ ...override, isOverridden: true });

    return makeNormalTypeFromPseudoTypes(input.pseudoType);
  }
