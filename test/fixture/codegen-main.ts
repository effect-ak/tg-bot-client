import { DocPage } from "#codegen/scrape/doc-page/_model";
import { Effect, Logger, LogLevel } from "effect";
import { test } from "vitest";

import { BotApiCodeWriterService, PageProviderService } from "#codegen/service/index.js";
import { OpenapiWriterService } from "#codegen-service/openapi-writer/_service.js";
import { TsMorpthWriter } from "#codegen-service/ts-morph-writer/_service";
import { BotApiCodegenRuntime } from "#codegen/runtime";

type Fixture = {
  readonly apiPage: DocPage
  readonly codeWriter: BotApiCodeWriterService
  readonly openApiWriter: OpenapiWriterService
  readonly tsMorph: TsMorpthWriter
};

const MainDependencies =
  Effect.gen(function* () {
    const htmlPageProvider = yield* PageProviderService;
    const apiPage = yield* htmlPageProvider.api;
    const webAppPage = yield* htmlPageProvider.webapp;
    const codeWriter = yield* BotApiCodeWriterService;
    const openApiWriter = yield* OpenapiWriterService;
    const tsMorph = yield* TsMorpthWriter;

    return { apiPage, webAppPage, codeWriter, openApiWriter, tsMorph } as const;
  }).pipe(
    Effect.provide(BotApiCodegenRuntime)
  );

const mainPromise =
  MainDependencies.pipe(
    Logger.withMinimumLogLevel(LogLevel.Debug),
    Effect.tapErrorCause(Effect.logError),
    Effect.runPromise
  );

export const fixture =
  test.extend<Fixture>(({
    apiPage: async ({ }, use) => {
      const { apiPage } = await mainPromise;
      use(apiPage);
    },
    codeWriter: async ({ }, use) => {
      const { codeWriter } = await mainPromise;
      use(codeWriter);
    },
    openApiWriter: async ({ }, use) => {
      const { openApiWriter } = await mainPromise;
      use(openApiWriter);
    },
    tsMorph: async ({ }, use) => {
      const { tsMorph} = await mainPromise;
      use(tsMorph);
    },
  }));
