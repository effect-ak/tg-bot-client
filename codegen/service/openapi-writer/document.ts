import type { OpenAPIV3_1 } from "openapi-types";

import { defaultBaseUrl } from "#/index.js";
import { ExtractedMethod } from "#codegen/scrape/extracted-method/_model.js";
import { ExtractedType } from "#codegen/scrape/extracted-type/_model.js";
import { responsesObject } from "./components.js";
import { makePath } from "./paths.js";

export const makeOpenApiDocument = 
  (input: {
    types: ExtractedType[]
    methods: ExtractedMethod[],
  }): OpenAPIV3_1.Document => {

  const paths = 
    Object.fromEntries(
      input.methods.map(m => [
        m.methodName,
        makePath(m)
      ])
    );

  const schemas =
    Object.fromEntries(
      input.types.map(t => [
        t.typeName,
        t.type.getOpenApiType()
      ])
    )

  return {
    openapi: "3.0.3",
    info: {
      title: "Telegram bot api",
      description: "Generated from official Telegram documentation",
      version: "8.2",
    },
    servers: [
      {
        url: defaultBaseUrl
      }
    ],
    tags: [],
    paths,
    components: {
      responses: {
        ...responsesObject
      },
      schemas
    }
  };

}
