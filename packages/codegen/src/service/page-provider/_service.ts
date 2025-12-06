import { Effect } from "effect"

import { DocPage } from "codegen/scrape/doc-page/_model"
import { WebAppPage } from "codegen/scrape/webapp/_model"
import { getPageHtml } from "./get-html"

export class PageProviderService extends Effect.Service<PageProviderService>()(
  "PageProviderService",
  {
    scoped: Effect.gen(function* () {
      yield* Effect.addFinalizer(() => Effect.logInfo("Closing scrapeDocPage"))

      yield* Effect.logInfo('init page provider')

      return {
        api: getPageHtml("api").pipe(Effect.andThen(DocPage.fromHtmlString)),
        webapp: getPageHtml("webapp").pipe(
          Effect.andThen(WebAppPage.fromHtmlString)
        )
      } as const
    })
  }
) {}
