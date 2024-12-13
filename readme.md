![NPM Version](https://img.shields.io/npm/v/%40effect-ak%2Ftg-bot-client)

[OpenApi Specification](https://effect-ak.github.io/telegram-bot-api/)

### What is it? 

This is a client for interacting with the Telegram Bot API.  
The main reason for creating this package is that Telegram does not provide an SDK for working with their API.

They only provide documentation in the form of a massive HTML page, which is very inconvenient for navigating and understanding what the Telegram Bot API offers.

## Features:
- **Pure TypeScript Client**: This is a clean client written in TypeScript with no abstractions.
- **Complete**: The entire API is generated from the official documentation [https://core.telegram.org/bots/api](https://core.telegram.org/bots/api) using a [code generator](./codegen/main.ts).
- ~~**Inline Documentation**: No need to read lengthy official documentation. All types and comments are available in JS DOC, allowing you to develop your bot without leaving your IDE.~~
  - Codegenerator produces TypeScript code and OpenApi specification now! Documentation was removed from TypeScript interfaces in order to keep npm package smaller.

- **Type Mapping**: Types from the documentation are converted to TypeScript types:
  - `Integer` becomes `number`
  - `True` becomes `boolean`
  - `String or Number` becomes `string | number`
  - Enumerated types, such as `Type of the chat, can be either “private”, “group”, “supergroup” or “channel”` becomes a standard union of literal types `"private"| "group" | "supergroup" | "channel"`
  - And so on
- **Readable Method Names**: Method names, such as `SetChatAdministratorCustomTitleInput`, are converted to snake_case for easier code readability, e.g., `set_chat_administrator_custom_title`.

### Usage example

#### Install

`npm i @effect-ak/tg-bot-client`

#### Creating a Client

```typescript
import { makeTgBotClient } from "@effect-ak/tg-bot-client"

const client = makeTgBotClient({
  token: "" //your token from bot father
});
```

#### Executing api methods, typesafety

`client` has an `execute` method which requires two arguments

- the first is the API method, e.g. `send_message`
- the second is an object containing the arguments for that method, e.g. `text`

`execute` never returns failed promise, instead, it gives an object with two fields, `success`, `error`.

if you want, you can use unsafe alternative, `unsafeExecute`, which gives you the result of method or throws an Error

#### 1. Sending a Message with an Effect

```typescript
import { MESSAGE_EFFECTS } from "@effect-ak/tg-bot-client"

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


#### 4. Getting a file

In order to download file from Telegram server we need to send two http requests:
1. execute `get_file` and get `remote_path`
2. get file content via GET request with different url

`client.getFile` does exactly that. It returns [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File)

```typescript
const file = 
  await client.getFile({ 
    file_id: fileId
  });
// file is File
```

---

### Summary

This code generator and client will continue to be developed. However, for now, I have generated all the methods and types. If you find any errors, please let me know.
