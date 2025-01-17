import { runTgChatBot } from "#/index.js"

runTgChatBot({
  type: "fromJsonFile",
  // log_level: "debug",
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
          file_content: new TextEncoder().encode(`your sum is ${result}`),
          file_name: "hello.txt"
        }
      }
    }

    const commandEntity = msg.entities?.find(_ => _.type == "bot_command");
    const command =
      commandEntity ? msg.text?.slice(commandEntity?.offset, commandEntity?.length) : undefined;

    console.info("echo bot", { command });

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

    if (msg.text) {
      return {
        type: "message",
        text: "hey :)"
      }
    }

  }
})