import { assert, describe, expect } from "vitest";

import { fixture } from "./fixture.js";

describe("telegram bot client, download file", () => {

  fixture("get file content", async ({ client, chat_id, skip }) => {

    const document =
      await client.unsafeExecute("send_document", {
        chat_id,
        document: {
          file_content: Buffer.from("Hello!"),
          file_name: "hello.txt"
        }
      });

    const fileId = document.document?.file_id;

    assert(fileId, "file id is null");

    const response =
      await client.getFile({ file_id: fileId });

    expect(response.success).toBeDefined();
  });

})
