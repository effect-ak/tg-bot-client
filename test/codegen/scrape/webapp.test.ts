import { assert, describe, expect, it } from "vitest";
import { webappFixture } from "../../fixture/codegen-webapp";

describe("webapp", () => {

  webappFixture("parse main app object", ({ webAppPage }) => {

    const page = webAppPage;

    const a = webAppPage.getEntity("Initializing Mini Apps");

    assert(a._tag == "Right");

    assert(a.right.type._tag == "EntityFields");

    expect(true);


  })


})