import type { OpenAPIV3_1 } from "openapi-types";

import type { ExtractedMethodShape } from "#codegen/scrape/extracted-method/_model.js";
import { errorResponseNames } from "./components.js";

export const makePath =
  (method: ExtractedMethodShape): OpenAPIV3_1.PathItemObject => {

    const inputSchema = method.parameters?.getOpenApiType();

    return {
      description: method.methodDescription.join("\n"),
      post: {
        requestBody: {
          content: {
            "application-json": {
              ...(inputSchema ? { schema: inputSchema as any }: undefined)
            }
          }
        },
        responses: {
          "400": {
            $ref: `#/components/responses/${errorResponseNames[0]}`
          }
        }
      }
    }

  }
