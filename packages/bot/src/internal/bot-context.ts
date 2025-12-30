import type { BotContext } from "./types"
import { BotResponse } from "./bot-response"

interface UpdateWithEntities {
  text?: string
  entities?: Array<{ type: string; offset: number; length: number }>
}

const extractCommand = (update: unknown): string | undefined => {
  if (typeof update !== "object" || update === null) return undefined
  const u = update as UpdateWithEntities
  if (!u.entities || !u.text) return undefined
  const entity = u.entities.find((e) => e.type === "bot_command")
  if (!entity) return undefined
  return u.text.slice(entity.offset, entity.offset + entity.length)
}

export const createBotContext = (update: unknown): BotContext => {
  const command = extractCommand(update)

  return {
    command,
    reply: (text, options) =>
      BotResponse.make({ type: "message", text, ...options }),
    replyWithDocument: (document, options) =>
      BotResponse.make({ type: "document", document, ...options }),
    replyWithPhoto: (photo, options) =>
      BotResponse.make({ type: "photo", photo, ...options }),
    ignore: BotResponse.ignore
  }
}
