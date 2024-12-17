import * as Micro from "effect/Micro";

import { TgBotClientError } from "../errors.js";
import { TgBotClientConfigObject } from "../config.js";
import { ClientExecuteRequestServiceInterface } from "../execute-request/_service.js";

export const getFile = (
  fileId: string,
  config: TgBotClientConfigObject,
  execute: ClientExecuteRequestServiceInterface
): Micro.Micro<File, TgBotClientError> =>

  Micro.gen(function* () {

    const response = yield* execute.execute("get_file", { file_id: fileId });

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

    const url = `${config.baseUrl}/file/bot${config.token}/${file_path}`;

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

  })