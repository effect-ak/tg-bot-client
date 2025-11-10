import * as Micro from "effect/Micro";
import * as Context from "effect/Context";

import { TgBotClientError } from "./errors";
import { TgBotApiBaseUrl, TgBotApiToken } from "./config";
import { executeTgBotMethod } from "./execute";

export class ClientFileService
  extends Context.Tag("ClientFileService")<ClientFileService, {
    getFile: (input: GetFile) => ReturnType<typeof getFile>
  }>() {

    static live = () => {
      return ClientFileService.context({
        getFile
      })
    }

  }

export interface GetFile {
  fileId: string
  type?: string
}

const getFile = ({ fileId, type }: GetFile) =>
  getFileBytes(fileId).pipe(
    Micro.andThen(
      ({ content, file_name }) =>
        new File([content], file_name, {
          ...(type ? { type } : undefined),
        })
    )
  );

const getFileBytes = (fileId: string) =>
  Micro.gen(function* () {
    const response = yield* executeTgBotMethod("get_file", { file_id: fileId });
    const file_path = response.file_path;

    if (!file_path || file_path.length == 0) {
      return yield* Micro.fail(
        new TgBotClientError({
          cause: {
            _tag: "UnableToGetFile",
            cause: "File path not defined",
          },
        })
      );
    }

    const file_name = file_path.replaceAll("/", "-");
    const baseUrl = yield* Micro.service(TgBotApiBaseUrl);
    const botToken = yield* Micro.service(TgBotApiToken);

    const url = `${baseUrl}/file/bot${botToken}/${file_path}`;

    const content = yield* Micro.tryPromise({
      try: () => fetch(url).then((_) => _.arrayBuffer()),
      catch: cause =>
        new TgBotClientError({
          cause: { _tag: "UnableToGetFile", cause },
        }),
    });

    return {
      content,
      file_name,
    };
  });
