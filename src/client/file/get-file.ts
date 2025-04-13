import { Micro } from "effect";

import { TgBotClientError } from "../errors";
import { TgBotClientConfig } from "../config";
import { execute } from "../execute-request/execute";

export const getFile = (
  fileId: string,
): Micro.Micro<File, TgBotClientError, TgBotClientConfig> =>

  Micro.gen(function* () {

    const response = yield* execute("get_file", { file_id: fileId });
    const config = yield* Micro.service(TgBotClientConfig);

    const file_path = response.file_path;

    if (!file_path || file_path.length == 0) {
      return yield* Micro.fail(
        new TgBotClientError({
          reason: {
            type: "UnableToGetFile",
            cause: "File path not defined"
          }
        })
      )
    }

    const file_name = file_path.replaceAll("/", "-");

    const url = `${config.base_url}/file/bot${config.bot_token}/${file_path}`;

    const fileContent =
      yield* Micro.tryPromise({
        try: () => fetch(url).then(_ => _.arrayBuffer()),
        catch: cause =>
          new TgBotClientError({
            reason: { type: "UnableToGetFile", cause }
          })
      });

    const file = new File([new Uint8Array(fileContent)], file_name);

    return file;

  });
