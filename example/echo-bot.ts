import { BotUpdatesHandlers, BotResponse, MESSAGE_EFFECTS, runTgChatBot } from "#/index";
import { Effect, pipe } from "effect";

const ECHO_BOT: BotUpdatesHandlers = {
  on_message: async (msg) => {

    if (msg.text?.includes("+")) {
      const numbers = msg.text.split("+");
      let result = 0;
      for (const num of numbers) {
        result += parseInt(num);
      }
      return BotResponse.make({
        type: "document",
        caption: "sum result",
        document: {
          file_content: new TextEncoder().encode(`your sum is ${result}`),
          file_name: "hello.txt"
        }
      })
    }

    const commandEntity = msg.entities?.find(_ => _.type == "bot_command");
    const command =
      commandEntity ? msg.text?.slice(commandEntity?.offset, commandEntity?.length) : undefined;

    console.info("echo bot", { command });

    if (command == "/bye") {
      return pipe(
        Effect.sleep("5 seconds"),
        Effect.andThen(() =>
          BotResponse.make({
            type: "message",
            text: "See you later!",
            reply_parameters: {
              message_id: msg.message_id
            },
            message_effect_id: MESSAGE_EFFECTS["❤️"]
          })
        ),
        Effect.runPromise
      )
    }

    if (command == "/echo") {
      return BotResponse.make({
        type: "message",
        text: `<pre language="json">${JSON.stringify(msg, undefined, 2)}</pre>`,
        parse_mode: "HTML"
      })
    }

    if (command == "/error") {
      throw new Error("boom");
    }

    if (msg.text) {
      return BotResponse.make({
        type: "message",
        text: "hey :)",
        reply_parameters: {
          message_id: msg.message_id
        }
      })
    }

    return BotResponse.ignore;

  }
};

runTgChatBot({
  type: "fromJsonFile",
  poll: {
    log_level: "debug",
    batch_size: 20,
  },
  mode: {
    type: "single",
    ...ECHO_BOT
  }
});
