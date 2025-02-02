import { BotResponse, runTgChatBot } from "#/index.js";

main();

async function main() {

  const bot =
    await runTgChatBot({
      type: "fromJsonFile",
      mode: {
        type: "single",
        on_message: (msg) => {

          if (!msg.text) return BotResponse.ignore;
  
          return BotResponse.make({
            type: "message",
            text: "hey :)"
          })
        }
      }
    });

  setTimeout(() => {
    console.log("time to reload")
    bot.reload({
      type: "single",
      on_message: (msg) => {

        if (!msg.text) return BotResponse.ignore;

        return BotResponse.make({
          type: "message",
          text: "reloaded hey :)"
        })
      }
    })
  }, 5000)

}
