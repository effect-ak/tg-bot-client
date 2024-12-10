import type { BotConfig } from "./_client.js";
import type { ExecuteRequest } from "./execute-request.js";

export const makeDownloadFile =
  (config: BotConfig, execute: ExecuteRequest) => {

    const getFile =
      async (input: {
        file_id: string
      }) => {

        const response = await execute("get_file", input);

        response.result?.file_path

        const file_path = response.result?.file_path;

        if (!file_path || file_path.length == 0)
          throw new Error("NoFilePath", { cause: response });

        const file_name = file_path.replaceAll("/", "-");

        const url = `${config.baseUrl}/file/bot${config.token}/${file_path}`;

        const fileContent = await fetch(url).then(_ => _.arrayBuffer());

        const file = new File([ new Uint8Array(fileContent) ], file_name);
        
        return file;

      };

    return {
      getFile
    } as const;

  }
