import { Effect } from "effect";

import { writeFile, readFile } from "fs/promises"

export const telegramApiDocs = "https://core.telegram.org/bots/api";

export const getPageHtml =
  (pagePath: string) =>
    Effect.tryPromise(async () => {

      const saved = await readFile(pagePath).catch(() => undefined);

      if (saved) {
        return saved.toString("utf-8");
      }

      const content = 
        await fetch(telegramApiDocs).then(_ => _.text());

      await writeFile(pagePath, content);

      return content;

    })