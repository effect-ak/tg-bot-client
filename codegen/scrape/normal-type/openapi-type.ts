import type { OpenAPIV3_1 } from "openapi-types";
import { isComplexType } from "#scrape/types.js";
import type { NormalTypeShape } from "./_model.js";

export const makeOpenApiType = (
  input: Pick<NormalTypeShape, "typeNames" | "openApiType">
): OpenAPIV3_1.SchemaObject | OpenAPIV3_1.ReferenceObject => {

  if (input.openApiType) {
    return input.openApiType;
  }

  if (input.typeNames[0] == "never") {
    return {
      type: "object",
      additionalProperties: false
    }
  }

  if (input.typeNames.length == 1) return fromSingleType(input.typeNames[0]);

  return {
    oneOf: input.typeNames.map(fromSingleType)
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
