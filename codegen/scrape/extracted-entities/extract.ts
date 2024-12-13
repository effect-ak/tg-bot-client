import { Either, String } from "effect";

import type { ExtractEntityError } from "#scrape/extracted-entity/errors.js";
import type { DocPage } from "#scrape/doc-page/_model.js";
import type { DocPageError } from "#scrape/doc-page/errors.js";
import type { ExtractMethodError } from "#scrape/extracted-method/errors.js";
import { isComplexType } from "#scrape/types.js";
import type { ExtractedEntitiesShape } from "./_model.js";
import { ExtractedEntitiesError } from "./errors.js";

const method_type_name_regex = /^\w+$/;

type ExtractError =
  ExtractEntityError | ExtractedEntitiesError | DocPageError | ExtractMethodError

export const extractFromPage = (
  page: DocPage,
): Either.Either<ExtractedEntitiesShape, ExtractError> => {

  const result: ExtractedEntitiesShape = {
    methods: [], types: []
  };

  const nodes = page.node.querySelectorAll("h3, h4");

  if (nodes.length == 0) 
    return Either.left(ExtractedEntitiesError.make("NodesNotFound"));

  let currentGroup: string | undefined;

  for (const node of nodes) {

    const title = node.childNodes.at(1)?.text;

    if (node.tagName == "H3") {
      currentGroup = node.childNodes.at(1)?.text;
      continue;
    }

    if (!currentGroup) 
      return Either.left(ExtractedEntitiesError.make("GroupNameNotDefined"));

    if (!title || !method_type_name_regex.test(title)) continue;

    if (isComplexType(title)) { // Is a Type

      const type = page.getType(title);

      if (type._tag == "Left") return Either.left(type.left)

      result.types.push(type.right);
      continue;
    }

    const method = page.getMethod(title);

    if (method._tag == "Left") return Either.left(method.left);

    result.methods.push({
      ...method.right,
      groupName: makeGroupName(currentGroup)
    });

  }

  result.methods.sort((a, b) => a.methodName.localeCompare(b.methodName))
  result.types.sort((a, b) => a.typeName.localeCompare(b.typeName))

  return Either.right(result);
}

const makeGroupName = (input: string) => 
  String.snakeToKebab(input.toLowerCase().replaceAll(" ", "_"))
