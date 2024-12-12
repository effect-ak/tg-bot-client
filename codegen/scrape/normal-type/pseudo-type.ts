import { Match, pipe, Array, Either } from "effect";

import type { NormalTypeShape } from "./_model.js";
import { NormalTypeError } from "./errors.js";
import { array_of_label, array_of_regex } from "./const.js";

export const makeNormalTypeFromPseudoTypes =
  (pseudoType: string): Either.Either<NormalTypeShape, NormalTypeError> => {

    if (pseudoType.includes(" or ")) {
      const typeNames = pseudoType.split(" or ").map(mapPseudoTypeToTsType);

      if (Array.isNonEmptyArray(typeNames) && typeNames[0].length > 0) {
        return Either.right({ typeNames })
      }

      return NormalTypeError.left("EmptyType", { typeName: pseudoType });

    } else if (pseudoType.startsWith(array_of_label)) {
      const typeName = mapPseudoTypeToTsType(makeArray(pseudoType));

      if (typeName.length > 0) {
        return Either.right({ typeNames: [typeName] });
      }

      return NormalTypeError.left("EmptyType", { typeName: pseudoType });
    } else {
      const typeNames = Array.make(mapPseudoTypeToTsType(pseudoType));

      if (typeNames[0].length == 0) {
        return NormalTypeError.left("EmptyType", { typeName: pseudoType });
      }

      return Either.right({ typeNames });

    }
  }

export const mapPseudoTypeToTsType =
  (typeName: string) =>
    pipe(
      Match.value(typeName),
      Match.when("String", () => "string"),
      Match.when("Integer", () => "number"),
      Match.when("Int", () => "number"),
      Match.when("Float", () => "number"),
      Match.when("Boolean", () => "boolean"),
      Match.when("True", () => "boolean"),
      Match.when("False", () => "boolean"),
      Match.orElse(() => typeName)
    );

const makeArray =
  (input: string) => {

    const dimension = [...input.matchAll(array_of_regex)].length;
    const typeName = mapPseudoTypeToTsType(input.replaceAll(array_of_regex, "").trim());

    return `${typeName}${"[]".repeat(dimension)}`;

  }
