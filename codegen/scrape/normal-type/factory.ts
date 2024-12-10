import { Either, Array } from "effect";

import { type NormalTypeShape } from "./_model.js";
import { typeOverrides } from "./overrides.js";
import { mapType } from "./map-type.js";
import { NormalTypeError } from "./errors.js";

const array_of_label = "Array of";
const array_of_regex = /array of/ig

const makeArray = 
  (input: string) => {

    const dimension = [...input.matchAll(array_of_regex)].length;
    const typeName = mapType(input.replaceAll(array_of_regex, "").trim());

    return `${typeName}${"[]".repeat(dimension)}`;

  }

export const makeFrom =
  (input: {
    entityName: string,
    fieldName: string,
    specType: string
  }): Either.Either<NormalTypeShape, NormalTypeError> => {
    const override = typeOverrides[input.entityName]?.[input.fieldName];

    if (override) return Either.right({ ...override, isOverridden: true });

    if (input.specType.includes(" or ")) {
      const typeNames = input.specType.split(" or ").map(mapType);

      if (Array.isNonEmptyArray(typeNames) && typeNames[0].length > 0) {
        return Either.right({ typeNames })
      }

      return NormalTypeError.left("EmptyType", input);

    } else if (input.specType.startsWith(array_of_label)) {
      const typeName = mapType(makeArray(input.specType));

      if (typeName.length > 0) {
        return Either.right({ typeNames: [ typeName ] });
      }

      return NormalTypeError.left("EmptyType", input);
    } else {
      const typeNames = Array.make(mapType(input.specType));

      if (typeNames[0].length == 0) {
        return NormalTypeError.left("EmptyType", input);
      }

      return Either.right({ typeNames });
    }
  }
