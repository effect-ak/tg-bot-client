import type { Update } from "#/specification/types.js";
import * as Context from "effect/Context";
import * as Micro from "effect/Micro";

export class BotMessageHandler
  extends Context.Tag("BotMessageHandler")<BotMessageHandler, {
    readonly batchWindowSize: number,
    readonly onUpdate: (_: Update) => boolean
  }>() { };

export const BotMessageHandlerDefault =
  Micro.succeed(
    BotMessageHandler.of({
      batchWindowSize: 10,
      onUpdate: () => true
    })
  );
