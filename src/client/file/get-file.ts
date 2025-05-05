import * as Micro from "effect/Micro";

import { TgBotClientError } from "../errors";
import { TgBotApiBaseUrl, TgBotApiToken } from "../config";
import { execute } from "../execute-request/execute";

export const getFile = (
  fileId: string
) =>

  Micro.gen(function* () {

    const response = yield* execute("get_file", { file_id: fileId });
    const file_path = response.file_path;

    if (!file_path || file_path.length == 0) {
      return yield* Micro.fail(
        new TgBotClientError({
          cause: {
            type: "UnableToGetFile",
            cause: "File path not defined"
          }
        })
      )
    }

    const file_name = file_path.replaceAll("/", "-");
    const baseUrl = yield* Micro.service(TgBotApiBaseUrl);
    const botToken = yield* Micro.service(TgBotApiToken);

    const url = `${baseUrl}/file/bot${botToken}/${file_path}`;

    const fileContent =
      yield* Micro.tryPromise({
        try: () => fetch(url).then(_ => _.arrayBuffer()),
        catch: cause =>
          new TgBotClientError({
            cause: { type: "UnableToGetFile", cause }
          })
      });

    return {
      content: fileContent,
      file_name
    }

  });
