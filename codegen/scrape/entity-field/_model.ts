import { Data } from "effect";

import { NormalType } from "#scrape/normal-type/_model.js";

export type EntityFieldShape = {
  name: string,
  type: NormalType,
  description: string[],
  required: boolean
}

export class EntityField
  extends Data.TaggedClass("EntityField")<EntityFieldShape> { }
