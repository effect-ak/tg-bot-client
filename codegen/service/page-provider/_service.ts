import { Config, Effect } from "effect";

import { DocPage } from "#scrape/doc-page/_model.js";
import { getPageHtml } from "./get-html.js";

export class PageProviderService
  extends Effect.Service<PageProviderService>()("PageProviderService", {
    scoped:
      Effect.gen(function* () {

        const pagePath =
          yield* Config.nonEmptyString("page-path");

        yield* Effect.addFinalizer(() => Effect.logInfo("Closing scrapeDocPage"));

        const htmlString =
          yield* getPageHtml(pagePath);

        const page = yield* DocPage.fromHtmlString(htmlString);

        return {
          page
        } as const;

      })
  }) { }
