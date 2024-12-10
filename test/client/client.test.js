import { describe, expect, assert, vi } from "vitest";
import { fixture } from "./fixture";
import { MESSAGE_EFFECTS } from "#/client/const";
const fetchSpy = vi.spyOn(global, "fetch");
describe("telegram bot client", () => {
    fixture("send dice", async ({ client, chat_id, skip }) => {
        skip();
        const response = await client.execute("send_dice", {
            chat_id,
            emoji: "🎲"
        });
        const url = fetchSpy.mock.calls[0][0];
        const lastPath = url.split('/').pop();
        expect(lastPath).toEqual("sendDice");
        assert(response != null);
        expect(response.result?.chat.id).toBeDefined();
    });
    fixture("send message", async ({ chat_id, client, skip }) => {
        skip();
        const response = await client.execute("send_message", {
            chat_id,
            text: "hey again",
            message_effect_id: MESSAGE_EFFECTS["🔥"]
        });
        expect(response.result?.chat.id).toBeDefined();
    });
    fixture("send message with keyboard", async ({ chat_id, client, skip }) => {
        skip();
        const response = await client.execute("send_message", {
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
        });
        expect(response.result?.chat.id).toBeDefined();
    });
    fixture("send document", async ({ chat_id, client, skip }) => {
        const response = await client.execute("send_document", {
            chat_id,
            message_effect_id: MESSAGE_EFFECTS["🎉"],
            document: {
                file_content: Buffer.from("Hello!"),
                file_name: "hello.txt"
            },
            caption: "simple text file"
        });
        expect(response.result?.chat.id).toBeDefined();
    });
});
