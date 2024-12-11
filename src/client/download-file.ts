import type { BotConfig } from "./_client.js";
import { TgBotClientError } from "./errors.js";
import type { ExecuteRequest } from "./execute-request.js";

type GetFileResult= {
  success?: File,
  error?: TgBotClientError
}

export const makeDownloadFile =(
  config: BotConfig,
  execute: ExecuteRequest
) => {

    const getFile =
      async (input: {
        file_id: string
      }): Promise<GetFileResult> => {

        const response = await execute.execute("get_file", input);

        if (response.error) return { error: response.error };

        const file_path = response.success?.file_path;

        if (!file_path || file_path.length == 0) {
          return {
            error: new TgBotClientError({
              type: "UnableToGetFile",
              cause: "File path not defined"
            })
          }
        }

        const file_name = file_path.replaceAll("/", "-");

        const url = `${config.baseUrl}/file/bot${config.token}/${file_path}`;

        try {
          const fileContent = await fetch(url).then(_ => _.arrayBuffer());

          const file = new File([ new Uint8Array(fileContent) ], file_name);
          
          return {
            success: file
          };
        } catch (cause) {
          return {
            error: new TgBotClientError({
              type: "UnableToGetFile", cause
            })
          }
        }

      };

    return {
      getFile
    } as const;

  }
