import { Data, Either, Array } from "effect";

import type { OpenAPIV3_1 } from "openapi-types";
import { ExtractedEntityField, isComplexType } from "#scrape/types.js";
import { makeFrom } from "./factory.js"
import { mapPseudoTypeToTsType } from "./pseudo-type.js";
import { makeOpenApiType } from "./openapi-type.js";

export type NormalTypeShape = {
  typeNames: Array.NonEmptyArray<string>
  openApiType?: OpenAPIV3_1.SchemaObject 
  isOverridden?: boolean
}

const union = (
  input: Array.NonEmptyArray<string>
) => input.join(" | ")

export class NormalType
  extends Data.TaggedClass("NormalType")<NormalTypeShape> {

  getOpenApiType() {
    return makeOpenApiType(this);
  }

  getTsType(typeNamespace?: string) {

    if (this.isOverridden) return this.typeNames[0];
    if (this.openApiType?.enum) return union(this.typeNames);
    if (!typeNamespace) return union(this.typeNames);
    const prefixed = 
      Array.map(this.typeNames, _ => isComplexType(_) ? `${typeNamespace}.${_}` : _);
    return union(prefixed);
 
  }

  static makeFromNames(...names: Array.NonEmptyArray<string>) {
    return new NormalType({
      typeNames: Array.map(names, mapPseudoTypeToTsType)
    })
  }

  static makeFrom(input: ExtractedEntityField) {
    return makeFrom(input).pipe(Either.andThen(_ => new NormalType(_)))
  };

}
