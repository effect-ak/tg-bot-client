import type { Api } from "@effect-ak/tg-bot-api"
import { executeTgBotMethod } from "./execute"
import type { TgBotConfig } from "./config"
import { getFile as getFileImpl, type GetFile } from "./client-file"

export interface TgBotClient {
  readonly execute: <M extends keyof Api>(
    method: M,
    input: Parameters<Api[M]>[0]
  ) => Promise<ReturnType<Api[M]>>
  readonly getFile: (input: GetFile) => Promise<File>
}

export interface MakeTgClient {
  bot_token: string
  base_url?: string
}

export function makeTgBotClient(config: MakeTgClient): TgBotClient {
  const tgConfig: TgBotConfig = {
    botToken: config.bot_token,
    ...(config.base_url ? { baseUrl: config.base_url } : {})
  }

  const execute = <M extends keyof Api>(
    method: M,
    input: Parameters<Api[M]>[0]
  ) => executeTgBotMethod({ config: tgConfig, method, input })

  return {
    execute,
    getFile: (input: GetFile) => getFileImpl(input, { config: tgConfig, execute })
  }
}
