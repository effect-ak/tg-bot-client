import * as Micro from "effect/Micro";
import * as Context from "effect/Context";

import { GetFile, getFile } from "./get-file";

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
