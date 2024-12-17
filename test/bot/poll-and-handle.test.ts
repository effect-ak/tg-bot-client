import { BotMessageHandler, BotMessageHandlerDefault } from "#/bot/message-handler/_service.js";
import { handleUntilFirstHandlerError } from "#/bot/update-poller/poll-and-handle.js";
import { ClientExecuteRequestService, ClientExecuteRequestServiceDefault } from "#/client/execute-request/_service.js";
import { Effect } from "effect";
import { assert, describe } from "vitest";
import { fixture } from "../client/fixture.js";
import { TgBotClientConfig } from "#/client/config.js";
import { defaultBaseUrl } from "#/index.js";

describe("poll and handle updates", () => {

  fixture("1", async ({ token }) => {

    const a = 
      await handleUntilFirstHandlerError.pipe(
        Effect.provideServiceEffect(ClientExecuteRequestService, ClientExecuteRequestServiceDefault),
        Effect.provideServiceEffect(BotMessageHandler, BotMessageHandlerDefault),
        Effect.provideService(TgBotClientConfig, { token, baseUrl: defaultBaseUrl }),
        Effect.runPromiseExit
      );

    assert(a._tag == "Success")

  })


})