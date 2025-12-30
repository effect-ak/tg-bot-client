import * as Micro from "effect/Micro"
import * as Data from "effect/Data"
import * as Fn from "effect/Function"
import { MESSAGE_EFFECTS } from "@effect-ak/tg-bot-client"
import { Update } from "@effect-ak/tg-bot-api"
import type {
  AvailableUpdateTypes,
  ExtractedUpdate,
  BotUpdatesHandlers,
  HandleBatchUpdateFunction,
  UpdateHandler,
  GuardedHandler,
  BotContext
} from "./types"
import { createBotContext } from "./bot-context"
import {
  BotPollSettingsTag,
  BotUpdateHandlersTag,
  PollSettings,
  BotTgClientTag
} from "./poll-settings"
import { BotResponse } from "./bot-response"

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

const executeHandler = <U>(
  handler: UpdateHandler<U>,
  update: U,
  ctx: BotContext
): BotResponse | PromiseLike<BotResponse> => {
  if (typeof handler === "function") {
    return handler(update)
  }
  if (Array.isArray(handler)) {
    return executeGuards(handler, update, ctx)
  }
  if (isGuardedHandler(handler)) {
    return executeSingleGuard(handler, update, ctx).then(
      (r) => r ?? BotResponse.ignore
    )
  }
  return BotResponse.ignore
}

export const extractUpdate = <U extends AvailableUpdateTypes>(
  input: Update
) => {
  for (const [field, value] of Object.entries(input)) {
    if (field == "update_id") {
      continue
    }
    return {
      type: field,
      ...value
    } as ExtractedUpdate<U>
  }

  return
}

export class BatchUpdateResult extends Data.Class<{
  hasErrors: boolean
  updates: Update[]
}> {}

export const handleUpdates = (updates: Update[]) =>
  Micro.gen(function* () {
    const pollSettings = yield* Micro.service(BotPollSettingsTag)
    const updateHandler = yield* Micro.service(BotUpdateHandlersTag)

    if (updateHandler.type == "single") {
      return yield* handleOneByOne(updates, updateHandler, pollSettings)
    } else {
      return yield* handleEntireBatch(updates, updateHandler)
    }
  })

export const handleEntireBatch = (
  updates: Update[],
  handlers: HandleBatchUpdateFunction
) =>
  Micro.try({
    try: () => handlers.on_batch(updates),
    catch: Fn.identity
  }).pipe(
    Micro.andThen((result) => {
      if (result instanceof Promise) {
        return Micro.tryPromise({
          try: () => result,
          catch: Fn.identity
        })
      } else {
        return Micro.succeed(result as boolean)
      }
    }),
    Micro.andThen(
      (doNext) =>
        new BatchUpdateResult({
          hasErrors: !doNext,
          updates
        })
    ),
    Micro.catchAll((error) => {
      console.warn("handle batch error", {
        errorMessage: error instanceof Error ? error.message : undefined,
        updates: updates.map((_) => Object.keys(_).at(1)),
        error
      })
      return Micro.succeed(
        new BatchUpdateResult({
          hasErrors: true,
          updates
        })
      )
    })
  )

export class HandleUpdateError extends Data.TaggedError("HandleUpdateError")<{
  name: "UnknownUpdate" | "HandlerNotDefined" | "BotHandlerError"
  update: Update
  cause?: unknown
}> {
  logInfo() {
    return {
      updateId: this.update.update_id,
      updateKey: Object.keys(this.update).at(1),
      name: this._tag,
      ...(this.cause instanceof Error && { error: this.cause.message })
    }
  }
}

export const handleOneByOne = (
  updates: Update[],
  handlers: BotUpdatesHandlers,
  pollSettings: PollSettings
) =>
  Micro.forEach(
    updates,
    (update) =>
      handleOneUpdate(update, handlers).pipe(
        Micro.catchAll((error) => {
          if (error instanceof HandleUpdateError) {
            console.warn("update handle error", error.logInfo())
          } else {
            console.warn("unknown error", error)
          }
          return Micro.succeed(error)
        })
      ),
    {
      concurrency: 10
    }
  ).pipe(
    Micro.andThen((batchResult) => {
      if (pollSettings.log_level == "debug") {
        console.debug("handle batch result", batchResult)
      }
      return new BatchUpdateResult({
        hasErrors: !batchResult.every((error) => error == null),
        updates
      })
    })
  )

export const handleOneUpdate = (
  updateObject: Update,
  handlers: BotUpdatesHandlers
) =>
  Micro.gen(function* () {
    const update = extractUpdate(updateObject)

    if (!update) {
      return yield* Micro.fail(
        new HandleUpdateError({
          name: "UnknownUpdate",
          update: updateObject
        })
      )
    }

    const handler = handlers[`on_${update.type}`] as UpdateHandler<typeof update>

    if (!handler) {
      return yield* Micro.fail(
        new HandleUpdateError({
          name: "HandlerNotDefined",
          update: updateObject
        })
      )
    }

    if (update.type == "message" && "text" in update) {
      console.info("Got a new text message", {
        chatId: update.chat.id,
        chatType: update.chat.type,
        message: `${update.text.slice(0, 5)}...`
      })
    }

    const ctx = createBotContext(update)

    let handleUpdateError: HandleUpdateError | undefined

    const handleResult = yield* Micro.try({
      try: () => executeHandler(handler, update, ctx),
      catch: (error) =>
        new HandleUpdateError({
          name: "BotHandlerError",
          update: updateObject,
          cause: error
        })
    }).pipe(
      Micro.andThen((handleResult) => {
        if (handleResult instanceof Promise) {
          // extract promise
          return Micro.tryPromise({
            try: () => handleResult as Promise<BotResponse>,
            catch: (error) =>
              new HandleUpdateError({
                name: "BotHandlerError",
                update: updateObject,
                cause: error
              })
          })
        }
        return Micro.succeed(handleResult as BotResponse)
      }),
      Micro.catchAll((error) => {
        handleUpdateError = error
        console.warn("error", error.logInfo())
        return Micro.succeed(
          BotResponse.make({
            type: "message",
            text: `Some internal error has happend(${error.name}) while handling this message`,
            message_effect_id: MESSAGE_EFFECTS["💩"],
            ...(updateObject.message?.message_id
              ? {
                  reply_parameters: {
                    message_id: updateObject.message?.message_id
                  }
                }
              : undefined)
          })
        )
      })
    )

    const pollSettings = yield* Micro.service(BotPollSettingsTag)

    if (!handleResult && pollSettings.log_level == "debug") {
      console.log(
        `Bot response is undefined for update with ID #${updateObject.update_id}.`
      )
      return
    }

    if ("chat" in update && handleResult.response) {
      const client = yield* Micro.service(BotTgClientTag)
      const responsePayload = handleResult.response
      const response = yield* Micro.tryPromise({
        try: () =>
          client.execute(`send_${responsePayload.type}` as any, {
            ...responsePayload,
            chat_id: update.chat.id
          } as any),
        catch: (error) => error
      })
      if (pollSettings.log_level == "debug" && "text") {
        console.debug("bot response", response)
      }
    }

    return handleUpdateError
  })
