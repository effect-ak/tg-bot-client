import { Either } from "effect"

import { HtmlElement } from "#codegen/types.js"
import { ExtractEntityError } from "./errors.js"
import { type_node_set } from "./const.js"

export const findTypeNode = (
  node: HtmlElement
): Either.Either<HtmlElement, ExtractEntityError> => {
  let resultNode = node.nextElementSibling
  const run = true
  let step = 1

  while (run) {
    if (resultNode?.tagName == "H4")
      return ExtractEntityError.left("TypeDefinition:StopTagEncountered")
    if (step > 10) return ExtractEntityError.left("TypeDefinition:NotFound")
    if (!resultNode) return ExtractEntityError.left("TypeDefinition:NoSiblings")
    if (type_node_set.has(resultNode?.tagName)) {
      return Either.right(resultNode)
    }
    resultNode = resultNode?.nextElementSibling
    step++
  }

  return ExtractEntityError.left("TypeDefinition:NotFound")
}
