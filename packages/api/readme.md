[![NPM Version](https://img.shields.io/npm/v/%40effect-ak%2Ftg-bot-api)](https://www.npmjs.com/package/@effect-ak/tg-bot-api)
![Telegram Bot API](https://img.shields.io/badge/BotApi-9.3-blue?link=)
![Telegram WebApp](https://img.shields.io/badge/Telegram.WebApp-9.1-blue?link=)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.1-blue.svg)](https://effect-ak.github.io/telegram-bot-api/)

## Highlights:

- **Complete and Up-to-Date Telegram Bot API**: The entire API is generated from [the official documentation](https://core.telegram.org/bots/api) using a [code generator](./codegen/main.ts), ensuring this client remains in sync and supports every method and type provided by the **Telegram Bot API**.
- **[Types for Webapps](#webapps-typings)** Types that describe `Telegram.WebApp`. Created by [code generator](./codegen/main.ts) as well.
- **[ChatBot runner](#chatbot-runner)**: Focus on the logic of your chat bot
- **Type Mapping**: Types from the documentation are converted to TypeScript types:
  - `Integer` → `number`
  - `True` → `boolean`
  - `String or Number` → `string | number`
  - Enumerated types, such as `"Type of the chat can be either “private”, “group”, “supergroup” or “channel”"`, are converted to a standard union of literal types `"private" | "group" | "supergroup" | "channel"`
  - And more...

## Webapps typings

Telegram provides a big [html](https://core.telegram.org/bots/webapps) page that describes `Telegram.WebApp`

```typescript
import type { WebApp } from "@effect-ak/tg-bot-client/webapp"

interface Telegram {
  WebApp: TgWebApp
}

declare const Telegram: Telegram

const saveData = () => {
  Telegram.WebApp.CloudStorage.setItem("key1", "some data", (error) => {
    if (error == null) {
      console.log("Saved!")
    }
  })
}
```
