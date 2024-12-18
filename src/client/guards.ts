export type FileContent = {
  file_content: Uint8Array
  file_name: string
}

export const isFileContent = 
  (input: unknown): input is FileContent =>
    (typeof input == "object" && input != null) &&
    ("file_content" in input && input.file_content instanceof Uint8Array) &&
    ("file_name" in input && typeof input.file_name == "string");

export type TgBotApiResponseSchema = {
  ok: boolean
  error_code?: number
  description?: string
  result?: unknown
}

export const isTgBotApiResponse = 
  (input: unknown): input is TgBotApiResponseSchema =>
    (typeof input == "object" && input != null) &&
    ("ok" in input && typeof input.ok == "boolean");

export type TgBotClientSettingsInput = {
  ["bot-token"]: string
  ["base-url"]?: string
}

export const isTgBotClientSettingsInput = 
  (input: unknown): input is TgBotClientSettingsInput =>
    (typeof input == "object" && input != null) &&
    ("bot-token" in input && typeof input["bot-token"] == "string");