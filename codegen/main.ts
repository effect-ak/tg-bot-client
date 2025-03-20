import { ConfigProvider, Effect, Layer, Logger, LogLevel, ManagedRuntime } from "effect";

import { ExtractedEntities } from "./scrape/extracted-entities/_model.js";
import { CodeWriterService, PageProviderService } from "./service/index.js";
import { OpenapiWriterService } from "./service/openapi-writer/_service.js";

const generateApi =
  Effect.gen(function* () {

    const pageProvider = yield* PageProviderService;
    const apiPage = yield* pageProvider.api;

    const apiVersion = yield* Effect.fromNullable(apiPage.getLatestVersion());

    const codeWriter = yield* CodeWriterService;
    const openapiWriter = yield* OpenapiWriterService;
    const entities = yield* ExtractedEntities.make(apiPage);

    codeWriter.writeTypes(entities.types);
    codeWriter.writeMethods(entities.methods);

    yield* openapiWriter.writeSpecification({
      ...entities,
      apiVersion
    });

    yield* codeWriter.saveFiles;

  });

const configProvider =
  ConfigProvider.fromJson({
    "scrapper-out-dir": [__dirname, "..", "src", "specification"],
    "openapi-out-dir": [__dirname, "..", "openapi"],
  });

export const live =
  ManagedRuntime.make(
    Layer.mergeAll(
      PageProviderService.Default,
      CodeWriterService.Default,
      OpenapiWriterService.Default,
    ).pipe(
      Layer.provide(Layer.setConfigProvider(configProvider)),
      Layer.provide(Logger.pretty)
    )
  );

generateApi.pipe(
  Effect.provide(live),
  Logger.withMinimumLogLevel(LogLevel.Debug),
  Effect.runPromise
).then(() => console.log("done generating"))
