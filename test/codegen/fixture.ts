import { Effect, Logger, LogLevel, ManagedRuntime } from "effect";
import { test } from "vitest";

import { CodeWriterService, PageProviderService } from "#codegen/service/index.js";
import { OpenapiWriterService } from "#codegen/service/openapi-writer/_service.js";
import { WebAppPage } from "#codegen/scrape/webapp/_model";
import { DocPage } from "#codegen/scrape/doc-page/_model";
import { live } from "#codegen/main";

type Fixture = {
  readonly apiPage: DocPage
  readonly webAppPage: WebAppPage
  readonly codeWriter: CodeWriterService
  readonly openApiWriter: OpenapiWriterService
};

const mainPromise =
  Effect.gen(function* () {
    console.log("creating fixture =>");

    const htmlPageProvider = yield* PageProviderService;
    const apiPage = yield* htmlPageProvider.api;
    const webAppPage = yield* htmlPageProvider.webapp;
    const codeWriter = yield* CodeWriterService;
    const openApiWriter = yield* OpenapiWriterService;

    return { apiPage, webAppPage, codeWriter, openApiWriter } as const;
  }).pipe(
    Effect.provide(live),
    Logger.withMinimumLogLevel(LogLevel.Debug),
    Effect.tapErrorCause(Effect.logError),
    Effect.runPromise
  );

export const fixture =
  test.extend<Fixture>(({
    webAppPage: async ({ }, use) => {
      const page = await mainPromise;
      use(page.webAppPage);
    },
    apiPage: async ({ }, use) => {
      const page = await mainPromise;
      use(page.apiPage);
    },
    codeWriter: async ({ }, use) => {
      const page = await mainPromise;
      use(page.codeWriter);
    },
    openApiWriter: async ({ }, use) => {
      const page = await mainPromise;
      use(page.openApiWriter);
    },
  }));

