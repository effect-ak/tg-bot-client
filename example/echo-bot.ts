import { BotResponse, runTgChatBot, defineBot, extractCommand } from "#dist/bot";
import { MESSAGE_EFFECTS } from "#dist/index";
import { Effect } from "effect";
import config from "../config.json"

const ECHO_BOT = defineBot({

  on_message: async (msg) => {

    const command = extractCommand(msg)
    console.info("echo bot", { command })

    if (!command) {
      return BotResponse.make({
        type: "message",
        text: "I'm expecting a command from you",
        reply_parameters: {
          message_id: msg.message_id
        }
      })
    }

    if (command.name == "/sum") {
      const numbers = command.args.split(" ");
      let result = numbers.reduce((result, num) => result + (parseInt(num) || 0), 0);
      return BotResponse.make({
        type: "message",
        text: `your sum is ${result}`
      })
    }

    if (command.name == "/bye") {
      await Effect.sleep("2 seconds").pipe(Effect.runPromise)
      return BotResponse.make({
        type: "message",
        text: "See you later!",
        reply_parameters: {
          message_id: msg.message_id
        },
        message_effect_id: MESSAGE_EFFECTS["❤️"]
      })
    }

    if (command.name == "/echo") {
      return BotResponse.make({
        type: "message",
        text: `<pre language="json">${JSON.stringify(msg, undefined, 2)}</pre>`,
        parse_mode: "HTML"
      })
    }

    if (command.name == "/error") {
      throw new Error(`Boom! ${command.args}`);
    }

    return BotResponse.make({
      type: "message",
      text: "Unknown command :/"
    })

  }
});

runTgChatBot({
  bot_token: config.bot_token,
  poll: {
    log_level: "debug",
    batch_size: 20,
    on_error: "continue"
  },
  mode: {
    type: "single",
    ...ECHO_BOT
  }
});
