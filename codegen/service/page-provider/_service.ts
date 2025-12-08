import { Effect } from "effect"

import { DocPage } from "#scrape/doc-page/_model.js"
import { getPageHtml } from "./get-html.js"
import { WebAppPage } from "#codegen/scrape/webapp/_model.js"

export class PageProviderService extends Effect.Service<PageProviderService>()(
  "PageProviderService",
  {
    scoped: Effect.gen(function* () {
      yield* Effect.addFinalizer(() => Effect.logInfo("Closing scrapeDocPage"))

      return {
        api: getPageHtml("api").pipe(Effect.andThen(DocPage.fromHtmlString)),
        webapp: getPageHtml("webapp").pipe(
          Effect.andThen(WebAppPage.fromHtmlString)
        )
      } as const
    })
  }
) {}
