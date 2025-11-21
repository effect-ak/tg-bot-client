import { Either } from "effect"
import { ExtractEntityError } from "codegen/scrape/extracted-entity/errors"
import { WebAppPage } from "codegen/scrape/webapp/_model"
import { extractEntities } from "codegen/scrape/extracted-entities/extract"
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

  const types = extractEntities(page)

  if (types._tag == "Left") {
    return Either.left(types)
  }

  return Either.right(
    new ExtractedWebApp({
      webapp: tgWebEvent.right,
      fields: tgWebEvent.right.type.fields,
      types: types.right.types
    })
  )
}

// const extractTypes = (
//   page: WebAppPage
// ) => {

//   const nodes = page.node.querySelectorAll("h3, h4");

//   if (nodes.length == 0)
//     return Either.left();

// }
