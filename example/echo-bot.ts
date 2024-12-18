import { runTgChatBot } from "../src/index.js"

runTgChatBot({
  type: "fromJsonFile",
  batchWindowSize: 10,
  on_edited_message: (edited) => {

    console.log("you have just edited the message", edited.text);

    return {
      type: "message",
      text: "fixed!"
    }
  },
  on_message: (msg) => {

    console.log("got a message", msg.text)

    return {
      type: "message",
      text: "hey :)"
    }
  }
})