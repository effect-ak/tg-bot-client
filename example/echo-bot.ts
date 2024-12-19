import { MESSAGE_EFFECTS, runTgChatBot } from "../src/index.js"

runTgChatBot({
  type: "fromJsonFile",
  on_message: (msg) => {

    if (msg?.text == "bye") {
      return {
        type: "message",
        text: "see you later!",
        message_effect_id: MESSAGE_EFFECTS["❤️"]
      }
    }

    return {
      type: "message",
      text: "I'm a simple bot"
    }
  }
})