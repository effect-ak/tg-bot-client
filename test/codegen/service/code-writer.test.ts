import { describe, assert } from "vitest";
import { Effect } from "effect";

import { fixture } from "../fixture";

describe("code writer service", () => {

  fixture("create file and write one line", async ({ codeWriter, skip }) => {    

    skip();

    const src = codeWriter.createTsFile("test2");

    assert(src._tag == "Right");

    src.right.addStatements(writer =>
      writer.writeLine("//** fist line")
    );

    const saved = await codeWriter.saveFiles.pipe(Effect.runPromiseExit);

    assert(saved._tag == "Success")

  })

});
