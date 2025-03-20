import { HtmlElement, parseStringToHtml } from "#codegen/types";
import { Data, Either } from "effect";

export class WebAppPage
  extends Data.Class<{
    node: HtmlElement
  }> {

  static fromHtmlString(html: string) {
    return parseStringToHtml(html).pipe(Either.andThen(node => new WebAppPage({ node })))
  }

  

}