import { Data, Either, pipe } from "effect";
import { HtmlElement, parseStringToHtml } from "#codegen/types";
import { ExtractedEntity } from "#scrape/extracted-entity/_model";
import { ExtractedType } from "../extracted-type/_model";

export class WebAppPage
  extends Data.Class<{
    node: HtmlElement
  }> {

  static fromHtmlString(html: string) {
    return parseStringToHtml(html).pipe(Either.andThen(node => new WebAppPage({ node })))
  }

  getEntity(name: string) {
    return pipe(
      Either.fromNullable(
        this.node.querySelector(`a.anchor[name="${name.toLowerCase().replaceAll(" ", "-")}"]`),
        () => new Error("Entity not found")
      ),
      Either.andThen(_ => ExtractedEntity.makeFrom(_.parentNode))
    );
  }

  getType(name: string) {
    return pipe(
      this.getEntity(name),
      Either.andThen(ExtractedType.makeFrom)
    )
  }

  getWebApp() {
    return pipe(
      this.getEntity("initializing mini apps")
    )
  }

}