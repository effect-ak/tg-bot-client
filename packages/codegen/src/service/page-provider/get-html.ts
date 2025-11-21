import { Effect } from "effect"

import { writeFile, readFile } from "fs/promises"

export type HtmlPageName = keyof typeof HtmlPages

const baseUrl = "https://core.telegram.org"

export const HtmlPages = {
  api: `${baseUrl}/bots/api`,
  webapp: `${baseUrl}/bots/webapps`
} as const

export const getPageHtml = (page: HtmlPageName) =>
  Effect.tryPromise(async () => {
    const fileName = `${page}.html`

    const saved = await readFile(fileName).catch(() => undefined)

    if (saved) saved.toString("utf-8")

    const content = await fetch(HtmlPages[page]).then((_) => _.text())

    await writeFile(fileName, content)

    return content
  })
