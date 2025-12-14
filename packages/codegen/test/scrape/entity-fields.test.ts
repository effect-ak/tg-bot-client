import { describe, expect, it } from "vitest"
import type { OpenAPIV3_1 } from "openapi-types"
import { EntityFields, type EntityField } from "~/scrape/entity-fields/_model"
import { NormalType } from "~/scrape/normal-type/_model"

describe("entity fields", () => {
  it("get json schema", () => {
    const check = (
      fields: EntityField[],
      expected: OpenAPIV3_1.SchemaObject
    ) => {
      const schema = new EntityFields({ fields }).getOpenApiType()
      expect(schema).toEqual(expected)
    }

    check(
      [
        {
          name: "field1",
          required: true,
          type: new NormalType({ typeNames: ["string"] }),
          description: ["field 1 description"]
        }
      ],
      {
        type: "object",
        properties: {
          field1: {
            type: "string",
            description: "field 1 description"
          }
        },
        required: ["field1"]
      }
    )
  })
})
