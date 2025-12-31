import type { Update } from "@effect-ak/tg-bot-api"
import { makeTgBotClient, type TgBotClient } from "@effect-ak/tg-bot-client"
import type {
  BotUpdatesHandlers,
  BotContext,
  GuardedHandler,
  UpdateHandler,
  AvailableUpdateTypes,
  ExtractedUpdate
} from "./internal/types"
import { createBotContext } from "./internal/bot-context"
import { BotResponse } from "./internal/bot-response"

export interface WebhookBotConfig extends BotUpdatesHandlers {
  bot_token: string
}

export interface WebhookHandler {
  (request: Request): Promise<Response>
  handleUpdate: (update: Update) => Promise<void>
}

const isGuardedHandler = <U>(
  handler: UpdateHandler<U>
): handler is GuardedHandler<U> =>
  typeof handler === "object" && handler !== null && "handle" in handler

const executeSingleGuard = async <U>(
  guard: GuardedHandler<U>,
  update: U,
  ctx: BotContext
): Promise<BotResponse | null> => {
  const input = { update, ctx }
  if (guard.match) {
    const matched = await guard.match(input)
    if (!matched) return null
  }
  return await guard.handle(input)
}

const executeGuards = async <U>(
  guards: GuardedHandler<U>[],
  update: U,
  ctx: BotContext
): Promise<BotResponse> => {
  for (const guard of guards) {
    const result = await executeSingleGuard(guard, update, ctx)
    if (result !== null) return result
  }
  return BotResponse.ignore
}

const executeHandler = async <U>(
  handler: UpdateHandler<U>,
  update: U,
  ctx: BotContext
): Promise<BotResponse> => {
  if (typeof handler === "function") {
    return await handler(update)
  }
  if (Array.isArray(handler)) {
    return await executeGuards(handler, update, ctx)
  }
  if (isGuardedHandler(handler)) {
    const result = await executeSingleGuard(handler, update, ctx)
    return result ?? BotResponse.ignore
  }
  return BotResponse.ignore
}

const extractUpdate = (input: Update): ExtractedUpdate<AvailableUpdateTypes> | undefined => {
  for (const [field, value] of Object.entries(input)) {
    if (field === "update_id") continue
    return { type: field, ...value } as ExtractedUpdate<AvailableUpdateTypes>
  }
  return undefined
}

const processUpdate = async (
  updateObject: Update,
  handlers: BotUpdatesHandlers,
  client: TgBotClient
): Promise<void> => {
  const update = extractUpdate(updateObject)
  if (!update) {
    console.warn("Unknown update format", updateObject)
    return
  }

  const handlerKey = `on_${update.type}` as keyof BotUpdatesHandlers
  const handler = handlers[handlerKey] as UpdateHandler<typeof update> | undefined

  if (!handler) {
    return
  }

  const ctx = createBotContext(update)

  try {
    const result = await executeHandler(handler, update, ctx)

    if (result.response && "chat" in update) {
      const responsePayload = result.response
      await client.execute(`send_${responsePayload.type}` as any, {
        ...responsePayload,
        chat_id: (update as any).chat.id
      } as any)
    }
  } catch (error) {
    console.error("Error handling update", {
      updateId: updateObject.update_id,
      error: error instanceof Error ? error.message : error
    })
  }
}

export const createWebhookHandler = (config: WebhookBotConfig): WebhookHandler => {
  const client = makeTgBotClient({ bot_token: config.bot_token })

  const handleUpdate = async (update: Update): Promise<void> => {
    await processUpdate(update, config, client)
  }

  const handler = async (request: Request): Promise<Response> => {
    try {
      const update = await request.json() as Update
      await handleUpdate(update)
      return new Response("ok", { status: 200 })
    } catch (error) {
      console.error("Webhook error", error)
      return new Response("error", { status: 500 })
    }
  }

  handler.handleUpdate = handleUpdate

  return handler
}
