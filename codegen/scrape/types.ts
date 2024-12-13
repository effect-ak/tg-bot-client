export type ExtractedEntityField = {
  entityName: string,
  fieldName: string,
  pseudoType: string,
  description: string[]
}

export const isComplexType =
  (input: string) =>
    input.length > 0 &&
    input.at(0)?.toUpperCase() == input.at(0);
