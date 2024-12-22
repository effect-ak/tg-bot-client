import { runTgChatBot } from "../src/index.js";

main()

async function main() {

  const bot =
    await runTgChatBot({
      type: "fromJsonFile",
      on_message: (msg) => {

        return {
          type: "message",
          text: "hey :)"
        }
      }
    });

  setTimeout(() => {
    bot.reload({
      on_message: (msg) => {

        return {
          type: "message",
          text: "reloaded hey :)"
        }
      }
    })
  }, 10000)

}