import { runTgChatBot } from "../dist/esm/index.js"

runTgChatBot({
  type: "fromJsonFile",
  batchWindowSize: 10,
  onUpdate: update => {
    console.log("Got a message", {
      text: update.message?.text,
      update_id: update.update_id
    });
    if (update.message?.text?.includes("failed")) {
      return false;
    }
    return true
  }
})