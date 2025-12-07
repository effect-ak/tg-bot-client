import { Data, Either, pipe } from "effect"
import {
  HtmlElement,
  HtmlPageDocumentation,
  parseStringToHtml
} from "~/types"
import { ExtractedEntity } from "~/scrape/extracted-entity/_model"
import { ExtractedType } from "~/scrape/extracted-type/_model"
import { ExtractEntityError } from "~/scrape/extracted-entity/errors"

export class WebAppPage
  extends Data.Class<{
    node: HtmlElement
  }>
  implements HtmlPageDocumentation
{
  static fromHtmlString(html: string) {
    return parseStringToHtml(html).pipe(
      Either.andThen((node) => new WebAppPage({ node }))
    )
  }

  getEntity(name: string) {
    return pipe(
      Either.fromNullable(
        this.node.querySelector(
          `a.anchor[name="${name.toLowerCase().replaceAll(" ", "-")}"]`
        ),
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

  getMethod = () => ExtractEntityError.left("NoMethods")

  getWebApp() {
    return pipe(this.getEntity("initializing mini apps"))
  }
}
