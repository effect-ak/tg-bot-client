import { TG_BOT_API_URL } from "./const"

export interface TgBotConfig {
  botToken: string
  baseUrl?: string
}

export const getBaseUrl = (config?: Pick<TgBotConfig, "baseUrl">): string => {
  return config?.baseUrl ?? TG_BOT_API_URL
}
