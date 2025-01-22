import { runTgChatBot } from "#/index.js";

main();

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
    console.log("time to reload")
    bot.reload({
      on_message: (msg) => {

        return {
          type: "message",
          text: "reloaded hey :)"
        }
      }
    })
  }, 5000)

}