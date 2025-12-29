import { TgBotClientError } from "./errors"
import type { ExecuteMethod } from "./execute"

export interface TgFile {
  readonly content: ArrayBuffer
  readonly file_name: string
  readonly base64String: () => string
  readonly file: () => File
}

export const getFile = async (params: {
  fileId: string
  config: {
    bot_token: string
    base_url: string
  }
  type?: string
  execute: ExecuteMethod
}): Promise<TgFile> => {
  const { fileId, config, execute } = params
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
  const url = `${config.base_url}/file/bot${config.bot_token}/${file_path}`

  let content: ArrayBuffer
  try {
    content = await fetch(url).then((_) => _.arrayBuffer())
  } catch (cause) {
    throw new TgBotClientError({
      cause: { _tag: "UnableToGetFile", cause }
    })
  }

  const base64String = () => Buffer.from(content).toString("base64")
  const file = () =>
    new File([content], file_name, {
      ...(params.type ? { type: params.type } : {})
    })

  return {
    content,
    file_name,
    base64String,
    file
  }
}
