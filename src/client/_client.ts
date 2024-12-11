import type { SetOptional} from "type-fest"
import { makeExecute } from "./execute-request.js";
import { makeDownloadFile } from "./download-file.js";

export type BotConfig = {
  token: string,
  baseUrl: string,
}

const defaultBaseUrl = "https://api.telegram.org";

export type TgBotClient = ReturnType<typeof makeTgBotClient>

export const makeTgBotClient =
  (inputConfig: SetOptional<BotConfig, "baseUrl">) => {

    const config: BotConfig = {
      ...inputConfig,
      baseUrl: inputConfig.baseUrl ?? defaultBaseUrl
    }

    const execute = makeExecute(config);
    const file = makeDownloadFile(config, execute);

    return {
      ...execute,
      ...file
    } as const;

  }
