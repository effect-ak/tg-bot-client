export type TgBotApiResponse<O> = {
  ok: boolean
  error_code?: number
  description?: string,
  result?: O
}

export const isTgBotApiResponse = 
  <O>(input: unknown): input is TgBotApiResponse<O> => {

    if (typeof input !== "object" || input == null) {
      return false;
    }

    if (!("ok" in input && typeof input.ok == "boolean")) {
      return false;
    }

    if ("error_code" in input && typeof input.error_code != "number") {
      return false;
    }

    if ("description" in input && typeof input.description != "string") {
      return false;
    }

    return true;
  };
