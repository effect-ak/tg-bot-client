import type { Api } from "@effect-ak/tg-bot-api"
import { executeTgBotMethod, type ExecuteMethod } from "./execute"
import { getFile as getFileImpl, type TgFile } from "./client-file"
import { TG_BOT_API_URL } from "./const"

export interface TgBotClient {
  readonly config: Required<TgClientConfig>
  readonly execute: ExecuteMethod
  readonly getFile: (input: { fileId: string; type?: string }) => Promise<TgFile>
}

export interface TgClientConfig {
  bot_token: string
  base_url?: string
}

export function makeTgBotClient(config: TgClientConfig): TgBotClient {
  const tgConfig = {
    bot_token: config.bot_token,
    base_url: config.base_url ?? TG_BOT_API_URL
  }

  const execute = <M extends keyof Api>(
    method: M,
    input: Parameters<Api[M]>[0]
  ) => executeTgBotMethod({
    config: tgConfig, method, input
  })

  return {
    config: tgConfig,
    execute,
    getFile: (input) => getFileImpl({ ...input, config: tgConfig, execute })
  }
}
