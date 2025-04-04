import { Either } from "effect";
import * as html_parser from "node-html-parser";

export type HtmlElement = import("node-html-parser").HTMLElement;
export type TsSourceFile = import("ts-morph").SourceFile;

export const parseStringToHtml =
  (html: string): Either.Either<html_parser.HTMLElement, string> => {
    const node = Either.try(() => html_parser.parse(html));
    if (Either.isLeft(node)) return Either.left("InvalidHtml");
    return Either.right(node.right)
  };
