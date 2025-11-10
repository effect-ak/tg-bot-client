export interface ExtractedEntityField {
  entityName: string,
  fieldName: string,
  pseudoType: string,
  description: string[]
}

export const startsWithUpperCase = 
  (input: string) => input.length > 0 && input.at(0)?.toUpperCase() == input.at(0)

export const isComplexType = startsWithUpperCase;
