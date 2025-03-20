import { Data, Either, pipe } from "effect";

import { HtmlElement, parseStringToHtml } from "#codegen/types.js";
import { ExtractedEntity } from "#codegen/scrape/extracted-entity/_model.js";
import { ExtractedType } from "#codegen/scrape/extracted-type/_model.js";
import { ExtractedMethod } from "#codegen/scrape/extracted-method/_model.js";

import { DocPageError } from "./errors.js";

export class DocPage
  extends Data.Class<{
    node: HtmlElement
  }> {

  static fromHtmlString(html: string) {
    return parseStringToHtml(html).pipe(Either.andThen(node => new DocPage({ node })))
  }

  getEntity(name: string) {
    return pipe(
      Either.fromNullable(
        this.node.querySelector(`a.anchor[name="${name.toLowerCase()}"]`),
        () => DocPageError.make("EntityNoFound", { entityName: name })
      ),
      Either.andThen(_ => ExtractedEntity.makeFrom(_.parentNode))
    )
  }

  getType(name: string) {
    return pipe(
      this.getEntity(name),
      Either.andThen(ExtractedType.makeFrom)
    )
  }

  getMethod(name: string) {
    return pipe(
      this.getEntity(name),
      Either.andThen(ExtractedMethod.makeFrom)
    )
  }

  getLatestVersion() {
    return this.node.querySelector("p > strong")?.text?.split(" ").at(-1);
  }

}
