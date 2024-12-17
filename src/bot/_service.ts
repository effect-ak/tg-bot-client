import * as Micro from "effect/Micro";
import * as Context from "effect/Context";

import { ClientExecuteRequestService, ClientExecuteRequestServiceDefault } from "#/client/execute-request/_service.js";
import { makeTgBotClientConfig, TgBotClientConfig } from "#/client/config.js";
import { BotUpdatePollerService, BotUpdatesPollerServiceDefault } from "./update-poller/_service.js";
import { TgBotClientSettingsInput } from "#/client/guards.js";

export class BotService extends
  Context.Tag("BotService")<BotService, {}>() { };

export const BotServiceDefault =
  (input: TgBotClientSettingsInput) =>
    Micro.gen(function* () {
      const poller = yield* Micro.service(BotUpdatePollerService);
      console.log({ poller })
    }).pipe(
      Micro.provideServiceEffect(ClientExecuteRequestService, ClientExecuteRequestServiceDefault),
      Micro.provideServiceEffect(BotUpdatePollerService, BotUpdatesPollerServiceDefault),
      Micro.provideService(TgBotClientConfig, makeTgBotClientConfig(input)),
      Micro.tapErrorCause(error => {
        console.error(error);
        return Micro.void;
      })
    ).pipe(
      Micro.andThen(BotService.of({}))
    );
