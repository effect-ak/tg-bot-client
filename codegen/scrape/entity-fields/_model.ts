import { Array, Data, Option } from "effect";

import { OpenAPIV3_1 } from "openapi-types";
import { NormalType } from "#scrape/normal-type/_model.js";

export type EntityField = {
  name: string,
  type: NormalType,
  description: string[],
  required: boolean
}

export class EntityFields
  extends Data.TaggedClass("EntityFields")<{
    fields: EntityField[]
  }> {

    getJsonSchema(): OpenAPIV3_1.SchemaObject | OpenAPIV3_1.ReferenceObject {

      const properties =
        Object.fromEntries(
          this.fields.map(field => [
            field.name,
            {
              ...field.type.getJsonSchema(),
              description: field.description.join("\n")
            }
          ])
        );

      const required = 
        Array.filterMap(this.fields, _ => _.required ? Option.some(_.name) : Option.none());

      return {
        type: "object",
        properties,
        required 
      }
    }

  };