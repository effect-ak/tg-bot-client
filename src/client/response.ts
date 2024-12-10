export type TgBotApiResponse<O> = {
  ok: boolean
  error_code?: number
  description?: string,
  result?: O
}

export const isTgBotApiResponse = 
  <O>(input: Record<string, unknown>): input is TgBotApiResponse<O> => {
    return (
      ("ok" in input && typeof input.ok == "boolean") &&
      (typeof input.error_code === 'undefined' || typeof input.error_code === 'number') &&
      (typeof input.description === 'undefined' || typeof input.description === 'string') &&
      (typeof input.result === 'undefined' || typeof input.result === 'object')
    )
  };
