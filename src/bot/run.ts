import * as Micro from "effect/Micro";
import { BotFactoryServiceDefault } from "./factory/_service.js";

const runBot =
  BotFactoryServiceDefault.runBot({
    type: "fromJsonFile",
    batchWindowSize: 10,
    onUpdate: update => {
      console.log("Got message", {
        text: update.message?.text,
        update_id: update.update_id
      });
      if (update.message?.text?.includes("fail")) {
        return false;
      }
      return true
    }
  })
