import { Micro, Context } from "effect";

import { getFile } from "./get-file";

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

    return {
      getFile: (
        input: Parameters<ClientFileServiceInterface["getFile"]>[0]
      ) =>
        getFile(input.file_id)

    } as const;
  });