import { describe, expect, it, assert } from "vitest"
import { OpenAPIV3_1 } from "openapi-types"

import { makeNormalTypeFromPseudoTypes } from "~/scrape/normal-type/pseudo-type.js"
import { makeOpenApiType } from "~/scrape/normal-type/openapi-type.js"
import { NormalTypeShape } from "~/scrape/normal-type/_model.js"
import { extractEnumFromTypeDescription } from "~/scrape/normal-type/enum.js"

describe("normal type", () => {
  it("make normal type from pseudo types", async () => {
    const check = (pseudo: string, expected: string[]) => {
      const t = makeNormalTypeFromPseudoTypes(pseudo)
      assert(t._tag == "Right")
      expect(t.right.typeNames).toEqual(expected)
    }

    check("String or Integer", ["string", "number"])
    check("Boolean", ["boolean"])
    check("True", ["boolean"])
    check("Array of String", ["string[]"])
    check("Array of Integer", ["number[]"])
    check("Array of ChatObject", ["ChatObject[]"])
  })

  it("make openapi type", () => {
    const check = (
      types: Pick<NormalTypeShape, "typeNames" | "openApiType">,
      expected: OpenAPIV3_1.SchemaObject | OpenAPIV3_1.ReferenceObject
    ) => {
      const schema = makeOpenApiType(types)
      expect(schema).toEqual(expected)
    }

    check(
      { typeNames: ["string"] },
      {
        type: "string"
      }
    )

    check(
      { typeNames: ["string", "number"] },
      {
        oneOf: [{ type: "string" }, { type: "number" }]
      }
    )

    check(
      { typeNames: ["string[][][]"] },
      {
        type: "array",
        items: {
          type: "array",
          items: { type: "array", items: { type: "string" } }
        }
      }
    )

    check(
      { typeNames: ["string[][][]"] },
      {
        type: "array",
        items: {
          type: "array",
          items: { type: "array", items: { type: "string" } }
        }
      }
    )

    check(
      { typeNames: ["Chat"] },
      {
        $ref: "#/components/schemas/Chat"
      }
    )

    check(
      { typeNames: ["Blaa"], openApiType: { type: "integer" } },
      {
        type: "integer"
      }
    )
  })

  it("extract enum from type description", () => {
    const check = (description: string[], expected: string[]) => {
      const actual = extractEnumFromTypeDescription(description)
      expect(actual).toEqual(expected)
    }

    check(["Type of the reaction, always “paid”"], ["paid"])

    check(
      ["Format of the sticker, must be one of “static”, “animated”, “video”"],
      ["static", "animated", "video"]
    )

    check(
      [
        "MIME type of the thumbnail, must be one of “image/jpeg”, “image/gif”, or “video/mp4”."
      ],
      ["image/jpeg", "image/gif", "video/mp4"]
    )

    check(["Type of the result, must be gif"], ["gif"])

    check(
      ["The member's status in the chat, always “restricted”"],
      ["restricted"]
    )

    check(["Nothing"], [])

    check([`Currently, it can be one of "👍", "👎", "❤"`], ["👍", "👎", "❤"])

    check(
      [
        `Type of the chat, can be either “private”, “group”, “supergroup” or “channel”`
      ],
      ["private", "group", "supergroup", "channel"]
    )
  })
})
