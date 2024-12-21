[![NPM Version](https://img.shields.io/npm/v/%40effect-ak%2Ftg-bot-client)](https://www.npmjs.com/package/@effect-ak/tg-bot-client)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.1-blue.svg)](https://effect-ak.github.io/telegram-bot-api/)
![NPM Unpacked Size](https://img.shields.io/npm/unpacked-size/%40effect-ak%2Ftg-bot-client)
![NPM Downloads](https://img.shields.io/npm/dw/%40effect-ak%2Ftg-bot-client)



### Motivation

The official documentation is available as a comprehensive [HTML page](https://core.telegram.org/bots/api), providing basic navigation. While functional, relying solely on this format can be somewhat inconvenient during bot development.

This client facilitates interaction with the Telegram Bot API. It was created primarily because Telegram does not offer an official SDK for their API.

## Features:
- **Typesafe Client**: This is a clean client written in TypeScript with no abstractions.
- **Complete**: The entire API is generated from [the official documentation](https://core.telegram.org/bots/api) using a [code generator](./codegen/main.ts)
- **Readable Method Names**: Method names, such as `setChatAdministratorCustomTitle`, are converted to snake_case for easier code readability, e.g., `set_chat_administrator_custom_title`.
- **Type Mapping**: Types from the documentation are converted to TypeScript types:
  - `Integer` becomes `number`
  - `True` becomes `boolean`
  - `String or Number` becomes `string | number`
  - Enumerated types, such as `Type of the chat, can be either “private”, “group”, “supergroup” or “channel”` becomes a standard union of literal types `"private"| "group" | "supergroup" | "channel"`
  - And so on

### Usage example

#### Creating a Client

```typescript
import { makeTgBotClient } from "@effect-ak/tg-bot-client"

const client = makeTgBotClient({
  token: "" //your token from bot father
});
```

#### Executing api methods

`client` has an `execute` method which requires two arguments

- the first is the API method, e.g. `send_message`
- the second is an object containing the arguments for that method, e.g. `text`

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
const file = 
  await client.getFile({ 
    file_id: fileId
  });
```

### Chatbot Support

You can write the logic for your chatbot and run it locally.

Take a look at [example](./example/echo-bot.ts)

The Telegram bot supports both push and pull notification models for messages. This package uses the **pull** model for several reasons:

- **Flexibility in Handler Deployment:** Allows you to run the bot handler on any JS platform (NodeJs, Browser) 
- **Sequential Message Processing:** Messages in the queue are read one by one, and the handler is invoked for each message. If an error occurs in the handler, the next message remains in the queue, and the bot stops running. When the handler successfully processes a message, it proceeds to the next one.

### Setup Instructions

1. **Create a `config.json` File**

   In the root of your project, create a `config.json` file with the following content:

   ```json
   {
     "bot-token": "your-token"
   }
   ```

   Replace `"your-token"` with your actual Telegram bot token.

2. **Create `bot.js` and Implement Your Bot's Logic**

   Create a file named `bot.js` and add your bot's logic as shown below:

   ```typescript
   import { MESSAGE_EFFECTS, runTgChatBot } from "@effect-ak/tg-bot-client"

   runTgChatBot({
     type: "fromJsonFile",
     on_message: (msg) => {
       if (msg?.text === "bye") {
         return {
           type: "message",
           text: "See you later!",
           message_effect_id: MESSAGE_EFFECTS["❤️"]
         }
       }

       return {
         type: "message",
         text: "I'm a simple bot"
       }
     }
   })
   ```

   **Explanation:**
   - **Import Statements:** Import necessary modules from the `@effect-ak/tg-bot-client` package.
   - **`runTgChatBot` Function:** Initializes the Telegram chatbot using the configuration from the `config.json` file.
   - **`on_message` Handler:** Defines the logic for handling incoming messages.
     - If the message text is `"bye"`, the bot responds with `"See you later!"` and adds a heart emoji effect.
     - For any other message, the bot responds with `"I'm a simple bot"`.

3. **Run the Bot**

   To start your chatbot, execute the following command in your terminal:

   ```bash
   node bot.js
   ```