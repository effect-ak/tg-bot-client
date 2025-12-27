import type { Api } from "@effect-ak/tg-bot-api"
import { TgBotClientError } from "./errors"
import type { TgBotConfig } from "./config"
import { getBaseUrl } from "./config"

export interface GetFile {
  fileId: string
  type?: string
}

export interface FileBytes {
  content: ArrayBuffer
  file_name: string
  base64String: () => string
}

interface FileContext {
  config: TgBotConfig
  execute: <M extends keyof Api>(
    method: M,
    input: Parameters<Api[M]>[0]
  ) => Promise<ReturnType<Api[M]>>
}

export const getFileBytes = async (
  fileId: string,
  context: FileContext
): Promise<FileBytes> => {
  const { config, execute } = context
  const response = await execute("get_file", { file_id: fileId })
  const file_path = response.file_path

  if (!file_path || file_path.length === 0) {
    throw new TgBotClientError({
      cause: {
        _tag: "UnableToGetFile",
        cause: "File path not defined"
      }
    })
  }

  const file_name = file_path.replaceAll("/", "-")
  const baseUrl = getBaseUrl(config)
  const botToken = config.botToken
  const url = `${baseUrl}/file/bot${botToken}/${file_path}`

  let content: ArrayBuffer
  try {
    content = await fetch(url).then((_) => _.arrayBuffer())
  } catch (cause) {
    throw new TgBotClientError({
      cause: { _tag: "UnableToGetFile", cause }
    })
  }

  const base64String = () => Buffer.from(content).toString("base64")

  return {
    content,
    file_name,
    base64String
  }
}

export const getFile = async (
  input: GetFile,
  context: FileContext
): Promise<File> => {
  const { content, file_name } = await getFileBytes(input.fileId, context)
  return new File([content], file_name, {
    ...(input.type ? { type: input.type } : {})
  })
}
