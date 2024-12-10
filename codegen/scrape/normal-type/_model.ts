import { Data, Either, Array } from "effect";

import { makeFrom } from "./factory.js"
import { mapType } from "./map-type.js";

export type NormalTypeShape = {
  typeNames: [string, ...string[]],
  isOverridden?: boolean
}

const union = (
  input: NormalTypeShape["typeNames"]
) => input.join(" | ")

export class NormalType
  extends Data.TaggedClass("NormalType")<NormalTypeShape> {

  getTsType(typeNamespace?: string) {

    if (this.isOverridden) return this.typeNames[0];
    if (!typeNamespace) return union(this.typeNames);
    const prefixed = 
      Array.map(this.typeNames, _ => _.at(0)?.toUpperCase() == _.at(0) ? `${typeNamespace}.${_}` : _);
    return union(prefixed);
 
  }

  static makeFromNames(...names: [string, ...string[]]) {
    return new NormalType({
      typeNames: Array.map(names, mapType)
    })
  }

  static makeFrom(input: Parameters<typeof makeFrom>[0]) {
    return makeFrom(input).pipe(Either.andThen(_ => new NormalType(_)))
  };

}
