import { runTgChatBot, MESSAGE_EFFECTS } from "../src/index.js"

runTgChatBot({
  type: "fromJsonFile",
  on_message: (msg) => {

    // 2+10+4+5

    if (msg.text?.includes("+")) {
      const numbers = msg.text.split("+");
      let result = 0;
      for (const num of numbers) {
        result += parseInt(num);
      }
      return {
        type: "document",
        caption: "sum result",
        document: {
          file_content: Buffer.from(`your sum is ${result}`),
          file_name: "hello.txt"
        }
      }
    }

    const commandEntity = msg.entities?.find(_ => _.type == "bot_command");
    const command = msg.text?.slice(commandEntity?.offset, commandEntity?.length);

    console.log("command", command);

    if (command == "/bye") {
      return {
        type: "message",
        text: "See you later!"
      }
    }

    if (command == "/echo") {
      return {
        type: "message",
        text: `<pre language="json">${JSON.stringify(msg, undefined, 2)}</pre>`,
        parse_mode: "HTML"
      }
    }

    console.log("got a message", msg.text)

    return {
      type: "message",
      text: "hey :)"
    }
  }
})