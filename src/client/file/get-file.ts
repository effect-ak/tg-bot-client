import * as Micro from "effect/Micro";

import { TgBotClientError } from "../errors";
import { TgBotApiBaseUrl, TgBotApiToken } from "../config";
import { execute } from "../execute-request/execute";

export const getFile = (
  fileId: string,
  type?: string
): Micro.Micro<File, TgBotClientError, TgBotApiToken> =>

  Micro.gen(function* () {

    const response = yield* execute("get_file", { file_id: fileId });
    const baseUrl = yield* Micro.service(TgBotApiBaseUrl);
    const botToken = yield* Micro.service(TgBotApiToken);

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

    const url = `${baseUrl}/file/bot${botToken}/${file_path}`;

    const fileContent =
      yield* Micro.tryPromise({
        try: () => fetch(url).then(_ => _.arrayBuffer()),
        catch: cause =>
          new TgBotClientError({
            reason: { type: "UnableToGetFile", cause }
          })
      });

    const file = new File([new Uint8Array(fileContent)], file_name, {
      ...(type ? {
        type
      }: undefined)
    });

    return file;

  });
