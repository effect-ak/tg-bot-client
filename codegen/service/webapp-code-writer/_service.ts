import { Effect } from "effect";
import type { TsSourceFile } from "#codegen/types.js";
import { TsMorpthWriter } from "../ts-morph-writer/_service";
import { ExtractedWebApp } from "#codegen/scrape/extracted-webapp/_model";

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
  }) { }

const writeWebApp =
  (src: TsSourceFile) =>
    (extractedWebApp: ExtractedWebApp) => {

      src.addInterface({
        name: "TgWebApp",
        isExported: true,
        properties:
          extractedWebApp.fields.map(field => ({
            name: field.name,
            type: field.type.getTsType()
          }))
      });

    }
