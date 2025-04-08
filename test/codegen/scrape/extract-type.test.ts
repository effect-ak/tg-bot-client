import { extractType } from "#codegen/scrape/extracted-entity/extract-type";
import { parse as parseHtml } from "node-html-parser";
import { describe, it } from "vitest";

describe("extract type", () => {

  it("get json schema", () => {

    const simpleTable = parseHtml(`
      <table>
        <tbody>
        <tr>
          <td>Field1</td>
          <td>String</td>
          <td>Some field description</td>
        </tr>
        </tbody>
      </table>
    `.trim());

    const a = extractType(simpleTable, "Entity1");

    const b = 1

  })


})