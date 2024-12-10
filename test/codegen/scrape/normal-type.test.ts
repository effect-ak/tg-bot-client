import { describe, expect, it, assert } from "vitest"
import { Either } from "effect"

import { NormalType } from "#scrape/normal-type/_model";

describe("normal type", () => {

  it("get normal type", async () => {

    const check =
      (docType: string, expected: string) => {
        const t = NormalType.makeFrom({
          entityName: "SomeUnknown",
          fieldName: "unknown",
          specType: docType
        }).pipe(Either.andThen(_ => _.getTsType()));
        assert(t._tag == "Right");
        expect(t.right, expected);
      }

    check("String or Integer", "string | number");
    check("Boolean", "boolean");
    check("True", "boolean");
    check("Array of String", "string[]");
    check("Array of Integer", "number[]");
    check("Array of ChatObject", "ChatObject[]");

  });

});
