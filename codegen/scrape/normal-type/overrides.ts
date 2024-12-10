import type { NormalTypeShape } from "./_model.js";

export const typeOverrides: Record<string, Record<string, NormalTypeShape>> = {
  Chat: {
    type: { typeNames: [ `"private" | "group" | "supergroup" | "channel"` ] }
  },
  sendMediaGroup: {
    media: { typeNames: [ "(T.InputMediaAudio | T.InputMediaDocument | T.InputMediaPhoto | T.InputMediaVideo)[]"] }
  },
  sendDice: {
    emoji: { typeNames: [ `"🎲" | "🎯" | "🏀" | "⚽" | "🎰"` ] }
  }
} as const;
