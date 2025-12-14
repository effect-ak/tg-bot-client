import { Either } from "effect"

import type { HtmlElement } from "~/types"
import type { ExtractedEntityShape } from "./_model"
import { NormalType } from "~/scrape/normal-type/_model"
import { ExtractEntityError } from "./errors"
import { findTypeNode } from "./find-type"
import { extractEntityDescription } from "./extract-description"
import { extractType } from "./extract-type"
import { typeAliasOverrides } from "./const"

export const extractFromNode = (
  node: HtmlElement
): Either.Either<ExtractedEntityShape, ExtractEntityError> => {
  const entityName = node.lastChild?.text?.trim()

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
