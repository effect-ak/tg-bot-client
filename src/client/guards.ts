import type { Update } from "./specification/types";

export interface FileContent {
  file_content: Uint8Array<ArrayBuffer>
  file_name: string
}

export const isFileContent = 
  (input: unknown): input is FileContent =>
    (typeof input == "object" && input != null) &&
    ("file_content" in input && input.file_content instanceof Uint8Array) &&
    ("file_name" in input && typeof input.file_name == "string");

export interface TgBotApiResponseSchema {
  ok: boolean
  error_code?: number
  description?: string
  result?: unknown
}

export const isTgBotApiResponse = 
  (input: unknown): input is TgBotApiResponseSchema =>
    (typeof input == "object" && input != null) &&
    ("ok" in input && typeof input.ok == "boolean");

export const isTgBotApiUpdate =
(input: unknown): input is Update =>
  (typeof input == "object" && input != null) &&
  ("update_id" in input && typeof input.update_id == "number");
