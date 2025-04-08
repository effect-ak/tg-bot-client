export type ExtractedEntityField = {
  entityName: string,
  fieldName: string,
  pseudoType: string,
  description: string[]
}

const typeRegex = /^[A-Z][A-Za-z]+$/

export const isComplexType =
  (input: string) => input.match(typeRegex);
