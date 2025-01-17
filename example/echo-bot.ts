import { BotMessageHandlers, MESSAGE_EFFECTS, runTgChatBot } from "#/index";

const ECHO_BOT: BotMessageHandlers = {
  on_message: (msg) => {

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
        text: "See you later!",
        message_effect_id: MESSAGE_EFFECTS["❤️"]
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
};

runTgChatBot({
  type: "fromJsonFile",
  ...ECHO_BOT
});