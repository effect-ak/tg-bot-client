import { Array, Either, pipe, Option } from "effect";

import type { HtmlElement } from "#codegen/types.js";
import type { ExtractedEntityShape } from "./_model.js";
import { mapPseudoTypeToTsType } from "#codegen/scrape/normal-type/pseudo-type.js";
import { new_entity_tag_set, returnTypeOverrides } from "./const.js";
import { ExtractEntityError } from "./errors.js";
import { isComplexType } from "../types.js";

const description_split_regex = /(\.\s{1,})|(\.<br>)/g;
const contains_letters_regex = /\w{1,}/;
const type_tags_regex = /\w+(?=\<\/(a|em)>)/g;
const html_tags_regex = /<\/?[^>]+>/g;

const isReturnSentence =
  (_: string) =>
    _.startsWith("On success") ||
    _.endsWith("is returned") ||
    _.startsWith("Returns ");

export const removeHtmlTags =
  (input: string) => input.replaceAll(html_tags_regex, "")

export const extractEntityDescription = (
  node: HtmlElement, entityName: string
): Either.Either<ExtractedEntityShape["entityDescription"], ExtractEntityError> => {

  const lines = [] as string[];

  let returnTypes = [] as string[];

  const returnTypeOverridden = returnTypeOverrides[entityName];

  let currentNode: HtmlElement | null = node.nextElementSibling;

  while (currentNode) {

    if (!currentNode || new_entity_tag_set.has(currentNode.tagName)) break;

    const splittedDescription = currentNode.innerHTML.split(description_split_regex);

    for (const line of splittedDescription) {

      if (!line || !contains_letters_regex.test(line)) continue;

      const plainLine = removeHtmlTags(line);

      if (!returnTypeOverridden && isReturnSentence(plainLine)) {
        const typeNames =
          pipe(
            Array.fromIterable(line.matchAll(type_tags_regex)),
            Array.filterMap(_ => {
              const originName = _[0];
              if (!isComplexType(originName)) {
                return Option.none();
              }
              const name = mapPseudoTypeToTsType(originName);
              const isArray = plainLine.toLowerCase().includes(`an array of ${name.toLowerCase()}`);
              return Option.some(`${name}${isArray ? "[]" : ""}`);
            })
          );

        if (Array.isNonEmptyArray(typeNames)) {
          returnTypes.push(...typeNames);
          continue;
        } else {
          console.warn("No return type found for ", {
            entityName,
            sentenceWithReturn: line
          })
        }
      };

      lines.push(plainLine);

    }

    currentNode = currentNode.nextElementSibling;

  }

  if (Array.isNonEmptyArray(lines) && lines[0].length != 0) {
    if (returnTypeOverridden) {
      return Either.right({
        lines,
        returns: { typeNames: returnTypeOverridden }
      })
    } else if (Array.isNonEmptyArray(returnTypes)) {
      return Either.right({
        lines,
        returns: { typeNames: Array.dedupe(returnTypes) }
      })
    } else {
      return Either.right({ lines, returns: undefined })
    }

  };

  return ExtractEntityError.left("Description:Empty", { entityName });
}

export const extractFieldDescription =
  (input: string) => {

    const lines = [] as string[];

    for (const line of input.split(description_split_regex)) {

      if (!line || !contains_letters_regex.test(line)) continue;

      lines.push(line);

    }

    return lines

  }
