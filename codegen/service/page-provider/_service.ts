import { Effect } from "effect";

import { DocPage } from "#scrape/doc-page/_model.js";
import { getPageHtml, HtmlPageName } from "./get-html.js";

export class PageProviderService
  extends Effect.Service<PageProviderService>()("PageProviderService", {
    scoped:
      Effect.gen(function* () {

        yield* Effect.addFinalizer(() => Effect.logInfo("Closing scrapeDocPage"));

        const makePage = 
          (pageName: HtmlPageName) => 
            getPageHtml(pageName).pipe(Effect.andThen(DocPage.fromHtmlString))

        return {
          api: makePage("api"), 
          webapp: makePage("webapp")
        } as const;

      })
  }) { }
