import { Either } from "effect";
import { parse as parseHtml, type HTMLElement } from "node-html-parser";
import type { ExtractEntityError } from "./scrape/extracted-entity/errors";
import type { ExtractedType } from "./scrape/extracted-type/_model";
import type { ExtractedMethod } from "./scrape/extracted-method/_model";

export type HtmlElement = import("node-html-parser").HTMLElement;
export type TsSourceFile = import("ts-morph").SourceFile;

export const parseStringToHtml =
  (html: string): Either.Either<HTMLElement, string> => {
    const node = Either.try(() => parseHtml(html));
    if (Either.isLeft(node)) return Either.left("InvalidHtml");
    return Either.right(node.right)
  };

export interface HtmlPageDocumentation {
  node: HtmlElement,
  getType: (name: string) => Either.Either<ExtractedType, ExtractEntityError>
  getMethod: (name: string) => Either.Either<ExtractedMethod, ExtractEntityError>
}
