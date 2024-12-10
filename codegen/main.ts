import { Effect, Logger, LogLevel } from "effect";

import { withConfig } from "./config.js";
import { ExtractedEntities } from "./scrape/extracted-entities/_model.js";
import { CodeWriterService, PageProviderService } from "./service/index.js";

const run =
  Effect.gen(function* () {

    const { page } = yield* PageProviderService;
    const codeWriter = yield* CodeWriterService;
    const entities = yield* ExtractedEntities.make(page);

    codeWriter.writeTypes(entities.types);
    codeWriter.writeMethods(entities.methods);

    yield* codeWriter.saveFiles;

  }).pipe(
    Effect.provide([
      PageProviderService.Default,
      CodeWriterService.Default
    ]),
    Effect.withConfigProvider(
      withConfig({
        pagePath: "tg-bot-api.html"
      })
    ),
    Logger.withMinimumLogLevel(LogLevel.Debug),
    Effect.runPromise
  );

run.then(() => console.log("done generating"))
