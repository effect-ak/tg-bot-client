import { describe, assert, expect } from "vitest";

import { ExtractedEntities } from "#codegen/scrape/extracted-entities/_model.js";
import { fixture } from "../fixture.js";

describe("page provider service", () => {

  fixture("extract all", async ({ page, skip }) => {    

    const all = ExtractedEntities.make(page);

    assert(all._tag == "Right");

    expect(all.right.methods.length).greaterThan(100);

  })

});
