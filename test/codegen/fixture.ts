import { Effect, Logger, LogLevel } from "effect";
import { test } from "vitest";

import { withConfig } from "#codegen/config.js";
import { DocPage } from "#scrape/doc-page/_model.js";
import { CodeWriterService, PageProviderService } from "#codegen/service/index.js";
import { OpenapiWriterService } from "#codegen/service/openapi-writer/_service.js";

type Fixture = {
  readonly page: DocPage
  readonly codeWriter: CodeWriterService
  readonly openApiWriter: OpenapiWriterService
};

const makeFixture =
  Effect.gen(function* () {

    console.log("creating fixture =>");

    const { page } = yield* PageProviderService;
    const codeWriter = yield* CodeWriterService;
    const openApiWriter = yield* OpenapiWriterService;

    return { page, codeWriter, openApiWriter } as const;
  }).pipe(
    Effect.provide([
      PageProviderService.Default,
      CodeWriterService.Default,
      OpenapiWriterService.Default,
      Logger.pretty
    ]),
    Effect.withConfigProvider(
      withConfig({
        pagePath: "tg-bot-api.html"
      })
    ),
    Logger.withMinimumLogLevel(LogLevel.Debug)
  );

const fixturePromise = 
  makeFixture.pipe(
    Effect.tapErrorCause(Effect.logError),
    Effect.runPromise
  ).catch(error => {
    const a = 1
    throw error
  });

export const fixture = test.extend<Fixture>(({
  page: async ({}, use) => {
    const page  = await fixturePromise;
    use(page.page);
  },
  codeWriter: async ({}, use) => {
    const page  = await fixturePromise;
    use(page.codeWriter);
  },
  openApiWriter: async ({}, use) => {
    const page  = await fixturePromise;
    use(page.openApiWriter);
  },
}));
