import { assert, describe, expect, it } from "vitest";

import { fixture } from "../fixture.js";
import { makeMethodRequestSchema, makePaths } from "#codegen/service/openapi-writer/paths.js";

describe("openapi", () => {

  fixture("generate path object", ({ page }) => {

    const method = page.getMethod("banChatMember");

    assert(method._tag == "Right");

    const schema = makeMethodRequestSchema(method.right);

    expect(schema)

  })


})