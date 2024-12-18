import type { OpenAPIV3_1 } from "openapi-types";
import { String } from "effect";

import type { ExtractedMethodShape } from "#codegen/scrape/extracted-method/_model.js";
import { removeHtmlTags } from "#codegen/scrape/extracted-entity/extract-description.js";
import { errorResponseNames } from "./components.js";

export const makePath =
  (method: ExtractedMethodShape): OpenAPIV3_1.PathItemObject => {

    const inputSchema = method.parameters?.getOpenApiType();
    const outputSchema = method.returnType.getOpenApiType();

    return {
      post: {
        tags: method.groupName ? [ method.groupName ] : [],
        summary: String.camelToSnake(method.methodName),
        description: method.methodDescription.map(removeHtmlTags).join("<br/>"),
        externalDocs: {
          url: `https://core.telegram.org/bots/api#${method.methodName.toLowerCase()}`,
          description: "telegram documentation"
        },
        requestBody: {
          content: {
            "application/json": {
              ...(inputSchema ? { schema: inputSchema as any }: undefined)
            }
          }
        },
        responses: {
          "200": {
            description: "success",
            content: {
              "application/json": {
                schema: outputSchema as any,
                example: method.returnType.getTsType()
              },
            }
          },
          "400": {
            $ref: `#/components/responses/${errorResponseNames[0]}`
          }
        }
      }
    }

  }
