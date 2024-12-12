import type { OpenAPIV3_1 } from "openapi-types";
import type { NormalTypeShape } from "./_model.js";

export const makeOpenApiType = (
  types: NormalTypeShape["typeNames"]
): OpenAPIV3_1.SchemaObject | OpenAPIV3_1.ReferenceObject => {

  if (types.length == 1) return fromSingleType(types[0])

  return {
    oneOf: types.map(fromSingleType)
  }

}

const fromSingleType =
  (typeName: string): OpenAPIV3_1.SchemaObject | OpenAPIV3_1.ReferenceObject => {

    const dimension = [...typeName.matchAll(/\[\]/g)].length;

    if (dimension == 0) {

      return makeTypeOrReference(typeName);

    } else {

      const baseType = typeName.slice(0, typeName.length - 2 * dimension);

      let result = {
        type: "array",
        items: makeTypeOrReference(baseType)
      } as OpenAPIV3_1.ArraySchemaObject;

      for (let i = 0; i < dimension - 1; i++) {

        result = { type: "array", items: result }

      };

      return result;

    }

  }

const makeTypeOrReference =
  (input: string): OpenAPIV3_1.ReferenceObject | OpenAPIV3_1.SchemaObject => {
    if (isComplexType(input)) {
      return {
        $ref: `#/components/schemas/${input}`
      }
    }

    return {
      type: input as any
    }
  }

const isComplexType =
  (input: string) =>
    input.length > 0 &&
    input.at(0)?.toUpperCase() == input.at(0);
