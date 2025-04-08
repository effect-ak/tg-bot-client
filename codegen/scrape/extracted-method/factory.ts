import { Either } from "effect";

import type { ExtractedEntityShape } from "#scrape/extracted-entity/_model.js";
import { NormalType } from "#scrape/normal-type/_model.js";
import { ExtractEntityError } from "#scrape/extracted-entity/errors.js";
import type { ExtractedMethodShape } from "./_model.js";

export const makeFrom = (
  entity: ExtractedEntityShape
): Either.Either<ExtractedMethodShape, ExtractEntityError> => {

  let parameters: ExtractedMethodShape["parameters"] | undefined;

  if (entity.type._tag == "EntityFields")
    parameters = entity.type;

  const returnType = entity.entityDescription.returns;

  if (!returnType) 
    return ExtractEntityError.left("Method:ReturnTypeNotFound", entity);

  return Either.right({
    methodName: entity.entityName,
    methodDescription: entity.entityDescription.lines,
    returnType: new NormalType({ typeNames: returnType.typeNames }),
    parameters,
    ...(entity.groupName ? { groupName: entity.groupName } : undefined )
  });

}
