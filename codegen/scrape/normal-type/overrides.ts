import type { NormalTypeShape } from "./_model.js";
import { CHAT_TYPES, DICES } from "./const.js";

export const typeOverrides: Record<string, Record<string, NormalTypeShape>> = {
  Chat: {
    type: { 
      typeNames: [ `${CHAT_TYPES.map(_ => `"${_}"`).join(" | ")}` ],
      openApiType: {
        type: "string",
        enum: CHAT_TYPES
      }
    }
  },
  sendMediaGroup: {
    media: { 
      typeNames: [ "(T.InputMediaAudio | T.InputMediaDocument | T.InputMediaPhoto | T.InputMediaVideo)[]"],
      openApiType: {
        type: "array",
        items: {
          oneOf: [
            { $ref: "#/components/schemas/InputMediaAudio" },
            { $ref: "#/components/schemas/InputMediaDocument" },
            { $ref: "#/components/schemas/InputMediaPhoto" },
            { $ref: "#/components/schemas/InputMediaVideo" },
          ]
        }
      }
    }
  },
  sendDice: {
    emoji: { 
      typeNames: [ `${DICES.map(_ => `"${_}"`).join(" | ")}` ],
      openApiType: {
        oneOf: [
          { 
            type: "string",
            enum: DICES
          }
        ]
      }
    },

  }
} as const;
