import type { NormalTypeShape } from "./_model.js";

export const typeOverrides: Record<string, Record<string, NormalTypeShape>> = {
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
  }
} as const;
