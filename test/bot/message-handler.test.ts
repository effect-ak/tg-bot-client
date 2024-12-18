import { extractUpdate } from "#/bot/message-handler/utils.js";
import { describe, expect, it } from "vitest";
import { ac } from "vitest/dist/chunks/reporters.D7Jzd9GS.js";

describe("message handler", () => {

  it("extract update", () => {

    const actual =
      extractUpdate({
        update_id: 1,
        message: {
          chat: { id: 1, type: "private" },
          date: 123,
          message_id: 1,
          text: "hey"
        }
      });

    expect(actual?.type).toEqual("message")

})

})