import type { OpenAPIV3_1 } from "openapi-types"

import { ExtractedMethod } from "codegen/scrape/extracted-method/_model"
import { ExtractedType } from "codegen/scrape/extracted-type/_model"
import { TG_BOT_API_URL } from "#/const"
import { responsesObject } from "./components"
import { makePath } from "./paths"

export const makeOpenApiDocument = (input: {
  apiVersion: string
  types: ExtractedType[]
  methods: ExtractedMethod[]
}): OpenAPIV3_1.Document => {
  const paths = Object.fromEntries(
    input.methods.map((m) => [`/${m.methodName}`, makePath(m)])
  )

  const schemas = Object.fromEntries(
    input.types.map((t) => [t.typeName, t.type.getOpenApiType()])
  )

  return {
    openapi: "3.1.0",
    info: {
      title: "Telegram bot api",
      description: "Generated from official Telegram documentation",
      version: input.apiVersion,
      contact: {
        name: "Aleksandr Kondaurov",
        url: "https://github.com/effect-ak/tg-bot-client/issues"
      },
      summary: [
        "[![NPM Version](https://img.shields.io/npm/v/%40effect-ak%2Ftg-bot-client)](https://www.npmjs.com/package/@effect-ak/tg-bot-client)"
      ].join("<br/>")
    },
    servers: [
      {
        url: `${TG_BOT_API_URL}/bot{bot-token}`,
        variables: {
          "bot-token": {
            default: "put-your-token",
            description: "take from bot father"
          }
        }
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
  }
}
