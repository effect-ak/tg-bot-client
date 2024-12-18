import type { Update } from "#/specification/types.js";
import * as Context from "effect/Context";

export type BotMessageHandlerSettings = {
  readonly batchWindowSize: number,
  readonly onUpdate: (_: Update) => boolean
}

export class BotMessageHandler
  extends Context.Tag("BotMessageHandler")<BotMessageHandler, BotMessageHandlerSettings>() { };

export const BotMessageHandlerDefault =
  BotMessageHandler.of({
    batchWindowSize: 10,
    onUpdate: update => {
      console.log("Got message", {
        text: update.message?.text,
        update_id: update.update_id
      });
      return true
    }
  });
