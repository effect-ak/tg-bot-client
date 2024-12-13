import { Data, Either, pipe } from "effect";
import * as html_parser from "node-html-parser";

import { HtmlElement } from "#codegen/types.js";
import { ExtractedEntity } from "#codegen/scrape/extracted-entity/_model.js";
import { ExtractedType } from "#codegen/scrape/extracted-type/_model.js";
import { ExtractedMethod } from "#codegen/scrape/extracted-method/_model.js";

import { DocPageError } from "./errors.js";

export class DocPage
  extends Data.Class<{
    node: HtmlElement
  }> {

  static fromHtmlString(html: string): Either.Either<DocPage, string> {
    const node = Either.try(() => html_parser.parse(html));
    if (Either.isLeft(node)) return Either.left("InvalidHtml");
    return Either.right(new DocPage({ node: node.right }))
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
