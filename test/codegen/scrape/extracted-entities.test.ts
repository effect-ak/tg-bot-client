import { describe, expect, assert } from "vitest"

import { fixture } from "../fixture.js";
import { ExtractedEntities } from "#scrape/extracted-entities/_model.js";

describe("extracted entities", () => {

  fixture("extract", async ({ apiPage }) => {

    const ns = ExtractedEntities.make(apiPage);

    if (ns._tag == "Left") {
      console.log(ns.left)
    }

    assert(ns._tag == "Right");

    expect(ns.right.methods.length).toBeGreaterThan(70);
    expect(ns.right.types.length).toBeGreaterThan(100);

  });

});
