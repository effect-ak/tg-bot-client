import { describe, expect, it, assert } from "vitest"
import { OpenAPIV3_1 } from "openapi-types";

import { makeNormalTypeFromPseudoTypes } from "#codegen/scrape/normal-type/pseudo-type.js";
import { makeOpenApiType } from "#codegen/scrape/normal-type/openapi-type.js";

describe("normal type", () => {

  it("make normal type from pseudo types", async () => {

    const check =
      (pseudo: string, expected: string[]) => {
        const t = makeNormalTypeFromPseudoTypes(pseudo);
        assert(t._tag == "Right");
        expect(t.right.typeNames).toEqual(expected);
      }

    check("String or Integer", ["string", "number"]);
    check("Boolean", ["boolean"]);
    check("True", ["boolean"]);
    check("Array of String", ["string[]"]);
    check("Array of Integer", ["number[]"]);
    check("Array of ChatObject", ["ChatObject[]"]);

  });

  it("make openapi type", () => {

    const check =
      (types: [string, ...string[]], expected: OpenAPIV3_1.SchemaObject | OpenAPIV3_1.ReferenceObject) => {
        const schema = makeOpenApiType(types);
        expect(schema).toEqual(expected);
      }

    check(["string"], {
      type: "string"
    });

    check(["string", "number"], {
      oneOf: [{ type: "string" }, { type: "number" }]
    });
    
    check(["string[][][]"], {
      type: "array", items: { type: "array", items: { type: "array", items: { type: "string" } } }
    });

    check(["string[][][]"], {
      type: "array", items: { type: "array", items: { type: "array", items: { type: "string" } } }
    });

    check(["Chat"], {
      $ref: "#/components/Chat"
    });

  })

});
