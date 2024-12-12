import type { OpenAPIV3_1 } from "openapi-types";

import { defaultBaseUrl } from "#/index.js";
import { responsesObject } from "./components.js";

type HeadPart = Required<Pick<OpenAPIV3_1.Document, "info" | "servers" | "tags" | "components">>

export const makeHead = () => {

  return ({
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
    components: {
      responses: {
        ...responsesObject
      } 
    }
  } as HeadPart);

}