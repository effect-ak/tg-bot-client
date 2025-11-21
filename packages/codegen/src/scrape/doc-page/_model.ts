import { Data, Either, pipe } from "effect"

import {
  HtmlElement,
  parseStringToHtml,
  HtmlPageDocumentation
} from "codegen/types"
import { ExtractedEntity } from "codegen/scrape/extracted-entity/_model"
import { ExtractedType } from "codegen/scrape/extracted-type/_model"
import { ExtractedMethod } from "codegen/scrape/extracted-method/_model"
import { ExtractEntityError } from "codegen/scrape/extracted-entity/errors"

export class DocPage
  extends Data.Class<{
    node: HtmlElement
  }>
  implements HtmlPageDocumentation
{
  static fromHtmlString(html: string) {
    return parseStringToHtml(html).pipe(
      Either.andThen((node) => new DocPage({ node }))
    )
  }

  getEntity(name: string) {
    return pipe(
      Either.fromNullable(
        this.node.querySelector(`a.anchor[name="${name.toLowerCase()}"]`),
        () =>
          ExtractEntityError.make("TypeDefinition:NotFound", {
            entityName: name
          })
      ),
      Either.andThen((_) => ExtractedEntity.makeFrom(_.parentNode))
    )
  }

  getType(name: string) {
    return pipe(this.getEntity(name), Either.andThen(ExtractedType.makeFrom))
  }

  getMethod(name: string) {
    return pipe(this.getEntity(name), Either.andThen(ExtractedMethod.makeFrom))
  }

  getLatestVersion() {
    return Either.fromNullable(
      this.node.querySelector("p > strong")?.text?.split(" ").at(-1),
      () => new Error("Html node with latest API version not found")
    )
  }
}
