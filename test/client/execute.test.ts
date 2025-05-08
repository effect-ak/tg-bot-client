import { describe, expect, assert, vi } from "vitest";

import { fixture } from "./fixture.js";
import { MESSAGE_EFFECTS } from "#/const.js";
import { Micro } from "effect";
import { executeTgBotMethod } from "#/client/execute-request/execute.js";

const fetchSpy = vi.spyOn(global, "fetch");

describe("telegram bot client, execute method", () => {

  fixture("send dice", async ({ chat_id, skip, context }) => {

    // skip();

    const response =
      await executeTgBotMethod("send_dice", {
        chat_id,
        emoji: "🎲",
        message_effect_id: MESSAGE_EFFECTS["🔥"]
      }).pipe(
        Micro.provideContext(context),
        Micro.runPromiseExit
      );

    assert(response._tag == "Success");

    const url = fetchSpy.mock.calls[0][0] as string;
    const lastPath = url.split('/').pop();

    expect(lastPath).toEqual("sendDice");

    assert(response != null);

    expect(response.value.chat.id).toBeDefined();
  });

  fixture("send message", async ({ chat_id, client, skip }) => {

    skip();

    const response =
      await client.execute("send_message", {
        chat_id,
        text: "hey again",
        message_effect_id: MESSAGE_EFFECTS["🔥"]
      });

    expect(response.chat.id).toBeDefined();

  });

  fixture("send message with keyboard", async ({ chat_id, client, skip }) => {

    skip();

    const response =
      await client.execute("send_message", {
        chat_id,
        text: "hey again!",
        message_effect_id: MESSAGE_EFFECTS["🎉"],
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "api documentation", 
                web_app: {
                  url: "https://core.telegram.org/api"
                }
              }
            ]
          ]
        }
      })

    expect(response.chat.id).toBeDefined();

  });

  fixture("send document", async ({ chat_id, client, skip }) => {

    skip();

    const response =
      await client.execute("send_document", {
        chat_id,
        message_effect_id: MESSAGE_EFFECTS["🎉"],
        document: {
          file_content: Buffer.from("Hello!"),
          file_name: "hello.txt"
        },
        caption: "simple text file"
      });

    expect(response.document?.file_id).toBeDefined();

    expect(response.chat.id).toBeDefined();

  });

});
