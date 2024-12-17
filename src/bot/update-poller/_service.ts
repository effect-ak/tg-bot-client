import * as Micro from "effect/Micro";
import * as Context from "effect/Context";

import { ClientExecuteRequestService, ClientExecuteRequestServiceDefault } from "#/client/execute-request/_service.js";
import { handleUntilFirstHandlerError } from "./poll-and-handle.js";

export type BotUpdatePollerServiceInterface =
  Micro.Micro.Success<typeof BotUpdatesPollerServiceDefault>;

export class BotUpdatePollerService
  extends Context.Tag("BotUpdatePollerService")<BotUpdatePollerService, BotUpdatePollerServiceInterface>() { };

export const BotUpdatesPollerServiceDefault =
  Micro.gen(function* () {

    const fiber =
      yield* handleUntilFirstHandlerError.pipe(Micro.forkDaemon);

    fiber.addObserver((exit) => {
      console.log("fibed was closed", exit)
    })

    return {
      fiber
    } as const;

  }).pipe(
    Micro.provideServiceEffect(ClientExecuteRequestService, ClientExecuteRequestServiceDefault)
  );
