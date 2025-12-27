[![NPM Version](https://img.shields.io/npm/v/%40effect-ak%2Ftg-bot-client)](https://www.npmjs.com/package/@effect-ak/tg-bot-client)
![NPM Unpacked Size](https://img.shields.io/npm/unpacked-size/%40effect-ak%2Ftg-bot-client?link=)
![NPM Downloads](https://img.shields.io/npm/dw/%40effect-ak%2Ftg-bot-client?link=)

## Motivation

**Telegram** does not offer an official TypeScript **SDK** for their **API** but they provide documentation in HTML format.

This package aims to parse official documentation of [Bot Api](https://core.telegram.org/bots/api) and [Telegram.Webapp](https://core.telegram.org/bots/api) and generate **TypeScript types**!

## Highlights:

- **[Client](#client)**: Light TypeScript client
- **Complete and Up-to-Date Telegram Bot API**: The entire API is generated from [the official documentation](https://core.telegram.org/bots/api) using a [code generator](./codegen/main.ts), ensuring this client remains in sync and supports every method and type provided by the **Telegram Bot API**.
- **[Types for Webapps](#webapps-typings)** Types that describe `Telegram.WebApp`. Created by [code generator](./codegen/main.ts) as well.
- **[ChatBot runner](#chatbot-runner)**: Focus on the logic of your chat bot
- **Type Mapping**: Types from the documentation are converted to TypeScript types:
  - `Integer` → `number`
  - `True` → `boolean`
  - `String or Number` → `string | number`
  - Enumerated types, such as `"Type of the chat can be either “private”, “group”, “supergroup” or “channel”"`, are converted to a standard union of literal types `"private" | "group" | "supergroup" | "channel"`
  - And more...

## Client

```typescript
import { makeTgBotClient } from "@effect-ak/tg-bot-client"

const client = makeTgBotClient({
  bot_token: "" //your token taken from bot father
})
```

### Executing api methods (Promise based)

`client` has an `execute` method which requires two arguments

- the first is the API method, e.g. `send_message`
- the second is an object containing the arguments for that method, e.g. `text`

> Method names, such as `setChatAdministratorCustomTitle`, are converted to snake_case for easier code readability, e.g., `set_chat_administrator_custom_title`.

#### 1. Sending a Message with an Effect

```typescript
import { MESSAGE_EFFECTS } from "@effect-ak/tg-bot-client"

await client.execute("send_message", {
  chat_id: "???", // replace ??? with the chat number
  text: "hey again",
  message_effect_id: MESSAGE_EFFECTS["🔥"]
})
```

#### 2. Sending a Dice

```typescript
import { MESSAGE_EFFECTS } from "@effect-ak/tg-bot-client"

await client.execute("send_dice", {
  chat_id: "???", // replace ??? with the chat number
  emoji: "🎲"
})
```

#### 3. Sending a Document

```typescript
import { MESSAGE_EFFECTS } from "@effect-ak/tg-bot-client"

await client.execute("send_document", {
  chat_id: "???", // replace ??? with the chat number
  message_effect_id: MESSAGE_EFFECTS["🎉"],
  document: {
    file_content: new TextEncoder().encode("Hello!"),
    file_name: "hello.txt"
  },
  caption: "simple text file"
})
```

#### 4. Getting a file

In order to download file from Telegram server we need to send two http requests:

1. execute `get_file` and get `remote_path`
2. get file content via GET request with different url

`client.getFile` does exactly that. It returns [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File)

```typescript
const file = await client.getFile({
  file_id: fileId
})
```

