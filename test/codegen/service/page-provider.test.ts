import { describe, assert, expect } from "vitest";

import { ExtractedEntities } from "#codegen/scrape/extracted-entities/_model.js";
import { fixture } from "../fixture.js";

describe("page provider service", () => {

  fixture("extract all", async ({ apiPage, skip }) => {    

    const all = ExtractedEntities.make(apiPage);

    assert(all._tag == "Right");

    expect(all.right.methods.length).greaterThan(100);

  })

});
