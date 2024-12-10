![NPM Version](https://img.shields.io/npm/v/%40effect-ak%2Ftg-bot-client)

### What is it? 

This is a client for interacting with the Telegram Bot API.  
The main reason for creating this package is that Telegram does not provide an SDK for working with their API.

They only provide documentation in the form of a massive HTML page, which is very inconvenient for navigating and understanding what the Telegram Bot API offers.

## Features:
- **Pure TypeScript Client**: This is a clean client written in TypeScript with no abstractions.
- **Complete**: The entire API is generated from the official documentation [https://core.telegram.org/bots/api](https://core.telegram.org/bots/api) using a [code generator](./codegen/main.ts).
- **Inline Documentation**: No need to read lengthy official documentation. All types and comments are available in JS DOC, allowing you to develop your bot without leaving your IDE.
- **Type Mapping**: Types from the documentation are converted to TypeScript types. For example, `Integer` becomes `number`, `True` becomes `boolean`, `String or Number` becomes `string | number`, and so on.
- **Readable Method Names**: Method names, such as `SetChatAdministratorCustomTitleInput`, are converted to snake_case for easier code readability, e.g., `set_chat_administrator_custom_title`.

### Usage example

#### Install

`npm i @effect-ak/tg-bot-client`

#### Creating a Client

```typescript
import { makeTgBotClient } from "effect-ak/tg-bot-client"

const client = makeTgBotClient({
  token: "" //your token from bot father
});
```

Now, `client` is an object that has an `execute` method. This method takes two arguments: the first is the API method, and the second is an object containing the arguments for that method.

#### 1. Sending a Message with an Effect

```typescript
import { MESSAGE_EFFECTS } from "effect-ak/tg-bot-client"

await client.execute("send_message", {
  chat_id: "???", // replace ??? with the chat number
  text: "hey again",
  message_effect_id: MESSAGE_EFFECTS["🔥"]
});
```

#### 2. Sending a Dice

```typescript
await client.execute("send_dice", {
  chat_id: "???", // replace ??? with the chat number
  emoji: "🎲"
});
```

#### 3. Sending a Document

```typescript
await client.execute("send_document", {
  chat_id: "???", // replace ??? with the chat number
  message_effect_id: MESSAGE_EFFECTS["🎉"],
  document: {
    file_content: Buffer.from("Hello!"),
    file_name: "hello.txt"
  },
  caption: "simple text file"
})
```

---

### Summary

This code generator and client will continue to be developed. However, for now, I have generated all the methods and types. If you find any errors, please let me know.
