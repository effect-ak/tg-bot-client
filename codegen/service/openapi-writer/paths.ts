import type { OpenAPIV3_1 } from "openapi-types";

import type { ExtractedMethod } from "#codegen/scrape/extracted-method/_model.js";
import { errorResponseNames } from "./components.js";

export const makePaths =
  (methods: ExtractedMethod[]) => {

    const paths =
      methods.map(m => ({
        [m.methodName]: makeMethodRequest(m),
      } as OpenAPIV3_1.PathsObject));

    return {
      paths
    } as const

  };

export const makeMethodRequest =
  (method: ExtractedMethod): OpenAPIV3_1.PathItemObject => {

    const inputSchema = method.parameters?.getJsonSchema();

    return {
      description: method.methodDescription.join("\n"),
      post: {
        requestBody: {
          content: {
            "application-json": {
              ...(inputSchema ? { schema: inputSchema }: undefined)
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
