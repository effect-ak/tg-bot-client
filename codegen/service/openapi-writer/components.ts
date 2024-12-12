import type { OpenAPIV3_1 } from "openapi-types";

export const errorResponseNames = [
  "ErrorResponse"
] as const;

export type ErrorResponseName = typeof errorResponseNames[number];

export const responsesObject: Record<ErrorResponseName, OpenAPIV3_1.ResponseObject> = {
  ErrorResponse: {
    description: "Something went wrong",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            error_code: {
              type: "integer",
            },
            description: {
              type: "string"
            },
          },
          required: [ "error_code" ]
        }
      }
    }
  }
};
