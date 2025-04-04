import { Effect } from "effect";
import type { TsSourceFile } from "#codegen/types.js";
import type { WebAppPage } from "#codegen/scrape/webapp/_model";
import { TsMorpthWriter } from "../ts-morph-writer/_service";
import { ExtractedEntity } from "#codegen/scrape/extracted-entity/_model";

export class WebAppCodeWriterService
  extends Effect.Service<WebAppCodeWriterService>()("WebAppCodeWriterService", {
    effect: 
      Effect.gen(function* () {

        const { createTsFile } = yield* TsMorpthWriter;

        const srcFile = yield* createTsFile("webapp");

        return {
          writeWebApp: writeWebApp(srcFile)
        } as const;
      })
  }) {}

const writeWebApp =
  (src: TsSourceFile) =>
    (webapp: ExtractedEntity) => {
      src.addInterface({
        name: "TgWebApp",
        isExported: true,
        properties: [
          {
            name: "one",
            type: "never"
          }
        ]
      })
    }
