import { Micro, Context } from "effect";

import { GetFile, getFile } from "./get-file";

export type ClientFileServiceInterface =
  Context.Tag.Service<typeof ClientFileService>;

export class ClientFileService
  extends Context.Tag("ClientFileService")<ClientFileService, {
    getFile: (input: GetFile) => ReturnType<typeof getFile>
  }> () {}

export const ClientFileServiceDefault =
  Micro.gen(function* () {
    return {
      getFile
    } as const;
  });
