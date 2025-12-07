import * as Micro from "effect/Micro"
import * as Context from "effect/Context"

import type { Api } from "@effect-ak/tg-bot-api"
import { executeTgBotMethod } from "./execute"
import { TgBotApiToken } from "./config"
import { GetFile, ClientFileService } from "./client-file"

export interface TgBotClient {
  readonly execute: <M extends keyof Api>(
    method: M,
    input: Parameters<Api[M]>[0]
  ) => Promise<ReturnType<Api[M]>>
  readonly getFile: (input: GetFile) => Promise<File>
}

interface MakeTgClient {
  bot_token: string
}

export function makeTgBotClient(config: MakeTgClient): TgBotClient {
  return createEffect(config).pipe(Micro.runSync)
}

const createEffect = ({ bot_token }: MakeTgClient) =>
  Micro.gen(function* () {
    const file = yield* Micro.service(ClientFileService)
    const context = Context.make(TgBotApiToken, bot_token)

    const execute = <M extends keyof Api>(
      method: M,
      input: Parameters<Api[M]>[0]
    ) =>
      executeTgBotMethod(method, input).pipe(
        Micro.provideContext(context),
        Micro.runPromise
      )

    const getFile = (input: GetFile) =>
      file.getFile(input).pipe(Micro.provideContext(context), Micro.runPromise)

    return {
      execute,
      getFile
    }
  }).pipe(Micro.provideContext(ClientFileService.live()))
