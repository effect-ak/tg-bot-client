import { makeTgBotClient, runTgChatBot } from "#/index"
import config from "../config.json"

const tgClient = 
  makeTgBotClient({
    bot_token: config.bot_token
  });

runTgChatBot({
  type: "fromJsonFile",
  poll: {
    log_level: "debug",
    batch_size: 100
  },
  mode: {
    type: "batch",
    on_batch: async updates => {
      console.log("got many updates!", updates.length);

      const messages = updates.map(_ => _.message).filter(_ => _ != null);

      await tgClient.execute("send_message", {
        chat_id: config.chat_id,
        text: `I got ${messages.length} messages`
      });

      return false;
    }
  }
});
