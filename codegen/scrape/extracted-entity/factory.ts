import { Either } from "effect"

import type { HtmlElement } from "#codegen/types.js"
import type { ExtractedEntityShape } from "./_model.js"
import { NormalType } from "#scrape/normal-type/_model.js"
import { ExtractEntityError } from "./errors.js"
import { findTypeNode } from "./find-type.js"
import { extractEntityDescription } from "./extract-description.js"
import { extractType } from "./extract-type.js"
import { typeAliasOverrides } from "./const.js"

export const extractFromNode = (
  node: HtmlElement
): Either.Either<ExtractedEntityShape, ExtractEntityError> => {
  const entityName = node.lastChild?.text

  if (!entityName) return ExtractEntityError.left("NoTitle")

  const entityDescription = extractEntityDescription(node, entityName)

  if (entityDescription._tag == "Left")
    return Either.left(entityDescription.left)

  const detailsNode = findTypeNode(node)

  if (Either.isLeft(detailsNode)) {
    if (detailsNode.left.error == "TypeDefinition:StopTagEncountered") {
      const overridden = typeAliasOverrides[entityName]
      return Either.right({
        entityName,
        entityDescription: entityDescription.right,
        type: new NormalType({
          typeNames: [overridden?.tsType ?? "never"],
          openApiType: overridden?.openApi
        })
      })
    }
    return Either.left({
      ...detailsNode.left,
      details: {
        entityName: entityName
      }
    })
  }

  const type = extractType(detailsNode.right, entityName)

  if (type._tag == "Left") return Either.left(type.left)

  return Either.right({
    entityName,
    entityDescription: entityDescription.right,
    type: type.right
  })
}
