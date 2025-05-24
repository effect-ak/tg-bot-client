import * as Micro from "effect/Micro";

import { TgBotClientError } from "../errors";
import { TgBotApiBaseUrl, TgBotApiToken } from "../config";
import { executeTgBotMethod } from "../execute-request/execute";

export type GetFile = {
  fileId: string
  type?: string
};

export const getFile = ({ fileId, type }: GetFile) =>
  getFileBytes(fileId).pipe(
    Micro.andThen(
      ({ content, file_name }) =>
        new File([ content ], file_name, {
          ...(type ? { type } : undefined),
        })
    )
  );

export const getFileAsBase64String = ({
  fileId,
  type,
}: GetFile & { type: string }) =>
  getFileBytes(fileId).pipe(
    Micro.andThen(({ content, file_name }) => {
      const encoded = Buffer.from(content).toString("base64");
      return {
        encoded: `data:${type};base64,${encoded}`,
        file_name
      }
    })
  );

export const getFileBytes = (fileId: string) =>
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
