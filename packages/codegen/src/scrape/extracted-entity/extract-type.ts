import { Either, Array, Match, pipe } from "effect"

import { HtmlElement } from "codegen/types"
import { EntityFields } from "codegen/scrape/entity-fields/_model"
import { NormalType } from "codegen/scrape/normal-type/_model"
import { ExtractEntityError } from "./errors"
import { ExtractedEntityShape } from "./_model"
import { extractFieldDescription } from "./extract-description"
import { INITIALING_MINI_APPS, optional_field_label } from "./const"

export const extractType = (
  node: HtmlElement,
  entityName: string
): Either.Either<ExtractedEntityShape["type"], ExtractEntityError> =>
  pipe(
    Match.value(node.tagName),
    Match.when("TABLE", () => extractFromTable(node, entityName)),
    Match.when("UL", () => extractFromList(node)),
    Match.orElse(() => ExtractEntityError.left("NoTypes"))
  )

const extractFromList = (node: HtmlElement) => {
  const oneOf: string[] = []

  const nodes = node.querySelectorAll("li")

  for (const node of nodes) {
    oneOf.push(node.text)
  }

  if (Array.isNonEmptyArray(oneOf)) {
    return Either.right(new NormalType({ typeNames: oneOf }))
  }

  return ExtractEntityError.left("NoTypes")
}

const extractFromTable = (node: HtmlElement, entityName: string) => {
  const fields = new EntityFields({ fields: [] })

  const rows = node.querySelectorAll("tbody tr")

  for (const row of rows) {
    const all = row.querySelectorAll("td")

    let fieldName = all.at(0)?.childNodes.at(0)?.text?.trim()
    if (!fieldName)
      return ExtractEntityError.left("NoColumn", {
        columnName: "name",
        entityName
      })
    let pseudoType = all.at(1)?.text
    if (!pseudoType)
      return ExtractEntityError.left("NoColumn", {
        columnName: "type",
        entityName
      })
    if (pseudoType == "Function") {
      const returnType =
        entityName == INITIALING_MINI_APPS ? "void" : entityName
      pseudoType = fieldName.endsWith("()") ? `() => ${returnType}` : "unknown"
      fieldName = fieldName.substring(0, fieldName.indexOf("("))
    }
    const descriptionNode = all.at(all.length - 1) // description is the last column
    if (!descriptionNode)
      return ExtractEntityError.left("NoColumn", {
        columnName: "description",
        entityName
      })

    const description = extractFieldDescription(descriptionNode)

    let required = false

    if (all.length == 3) {
      const isOptional = description[0].includes(optional_field_label)
      if (isOptional) description.shift()
      required = isOptional == false
    } else {
      const isRequired = all.at(2)?.text
      if (!isRequired)
        return ExtractEntityError.left("NoColumn", {
          columnName: "required",
          entityName
        })
      if (isRequired != optional_field_label && isRequired != "Yes") {
        return ExtractEntityError.left("UnexpectedValue", {
          columnName: "required",
          entityName
        })
      }
      required = isRequired != optional_field_label
    }

    const normalType = NormalType.makeFrom({
      entityName,
      fieldName,
      pseudoType,
      description
    })

    if (Either.isLeft(normalType)) {
      console.warn(normalType.left)
      continue
    }

    fields.fields.push({
      name: fieldName,
      description,
      required,
      type: normalType.right
    })
  }

  fields.fields.sort((a, b) => (b.required ? 1 : 0) - (a.required ? 1 : 0))

  return Either.right(fields)
}
