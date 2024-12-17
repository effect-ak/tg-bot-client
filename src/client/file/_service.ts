import * as Micro from "effect/Micro";
import * as Context from "effect/Context";

import { TgBotClientConfig } from "../config.js";
import { ClientExecuteRequestService, ClientExecuteRequestServiceDefault } from "../execute-request/_service.js";
import { getFile } from "./get-file.js";

export type ClientFileServiceInterface =
  Context.Tag.Service<typeof ClientFileService>;

export class ClientFileService
  extends Context.Tag("ClientFileService")<ClientFileService, {
    getFile: (input: {
      file_id: string
    }) => ReturnType<typeof getFile>
  }> () {}

export const ClientFileServiceDefault =
  Micro.gen(function* () {
    const config = yield* Micro.service(TgBotClientConfig);
    const execute = yield* Micro.service(ClientExecuteRequestService);

    return {
      getFile: (
        input: Parameters<ClientFileServiceInterface["getFile"]>[0]
      ) =>
        getFile(input.file_id, config, execute)

    } as const;
  }).pipe(
    Micro.provideServiceEffect(ClientExecuteRequestService, ClientExecuteRequestServiceDefault)
  );
