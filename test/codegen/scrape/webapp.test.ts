import { assert, describe, expect, it } from "vitest";
import { webappFixture } from "../../fixture/codegen-webapp";
import { ExtractedWebApp } from "#codegen/scrape/extracted-webapp/_model";

describe("webapp", () => {

  webappFixture("parse main app object", ({ webAppPage }) => {

    const a = ExtractedWebApp.make(webAppPage);

    assert(a._tag == "Right");

    expect(true);


  });




})