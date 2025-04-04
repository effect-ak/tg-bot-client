import { Data } from "effect";

export type LambdaTypeShape = {
  input: string[]
  output: string
}

export class LambdaType
  extends Data.TaggedClass("LambdaType")<LambdaTypeShape> {};
