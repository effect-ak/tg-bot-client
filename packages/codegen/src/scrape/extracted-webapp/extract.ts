import { Either } from "effect"
import { ExtractEntityError } from "~/scrape/extracted-entity/errors"
import { WebAppPage } from "~/scrape/webapp/_model"
import { extractWebAppEntities } from "~/scrape/extracted-entities/extract"
import { ExtractedWebApp } from "./_model"

export const extractFromPage = (page: WebAppPage) => {
  const tgWebEvent = page.getWebApp()

  if (
    tgWebEvent._tag == "Left" ||
    tgWebEvent.right.type._tag != "EntityFields"
  ) {
    return ExtractEntityError.left("TypeDefinition:NotFound", {
      entityName: "WebApp"
    })
  }

  const nodes = page.node.querySelectorAll("h4")

  if (nodes.length == 0) {
    return ExtractEntityError.left("TypeDefinition:NotFound", {
      entityName: "types"
    })
  }

  const types = extractWebAppEntities(page)

  if (types._tag == "Left") {
    return Either.left(types)
  }

  return Either.right(
    new ExtractedWebApp({
      webapp: tgWebEvent.right,
      fields: tgWebEvent.right.type.fields,
      types: types.right
    })
  )
}
