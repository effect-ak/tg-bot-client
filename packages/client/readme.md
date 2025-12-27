# @effect-ak/tg-bot-client

[![NPM Version](https://img.shields.io/npm/v/%40effect-ak%2Ftg-bot-client)](https://www.npmjs.com/package/@effect-ak/tg-bot-client)
![NPM Unpacked Size](https://img.shields.io/npm/unpacked-size/%40effect-ak%2Ftg-bot-client?link=)
![NPM Downloads](https://img.shields.io/npm/dw/%40effect-ak%2Ftg-bot-client?link=)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Type-safe HTTP client for Telegram Bot API with complete TypeScript support.

## Table of Contents

- [Motivation](#motivation)
- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage Examples](#usage-examples)
  - [Sending Messages](#sending-messages)
  - [Sending Files](#sending-files)
  - [Downloading Files](#downloading-files)
  - [Using Message Effects](#using-message-effects)
- [Error Handling](#error-handling)
- [API Reference](#api-reference)
- [Configuration](#configuration)
- [Related Packages](#related-packages)
- [Contributing](#contributing)
- [License](#license)

## Motivation

**Telegram** does not offer an official TypeScript **SDK** for their **API** but they provide documentation in HTML format.

This package provides a lightweight, type-safe HTTP client that uses types generated from the [official Telegram Bot API documentation](https://core.telegram.org/bots/api), ensuring it stays in sync with the latest API updates.

## Features

- **Type-Safe**: Full TypeScript support with types generated from official documentation
- **Lightweight**: Minimal dependencies
- **Complete API Coverage**: All Bot API methods are supported
- **Smart Type Conversion**: Automatic mapping of Telegram types to TypeScript:
  - `Integer` → `number`
  - `True` → `boolean`
  - `String or Number` → `string | number`
  - Enumerated types → Union of literal types (e.g., `"private" | "group" | "supergroup" | "channel"`)
- **File Handling**: Simplified file upload and download
- **Message Effects**: Built-in constants for message effects
- **Custom Base URL**: Support for custom Telegram Bot API servers

## Installation

```bash
npm install @effect-ak/tg-bot-client
```

```bash
pnpm add @effect-ak/tg-bot-client
```

```bash
yarn add @effect-ak/tg-bot-client
```

## Quick Start

```typescript
import { makeTgBotClient } from "@effect-ak/tg-bot-client"

const client = makeTgBotClient({
  bot_token: "YOUR_BOT_TOKEN" // Token from @BotFather
})

// Send a message
await client.execute("send_message", {
  chat_id: "123456789",
  text: "Hello, World!"
})
```

## Usage Examples

### Sending Messages

#### Basic Text Message

```typescript
await client.execute("send_message", {
  chat_id: "123456789",
  text: "Hello from TypeScript!"
})
```

#### Message with Formatting

```typescript
await client.execute("send_message", {
  chat_id: "123456789",
  text: "*Bold* _italic_ `code`",
  parse_mode: "Markdown"
})
```

#### Message with Inline Keyboard

```typescript
await client.execute("send_message", {
  chat_id: "123456789",
  text: "Choose an option:",
  reply_markup: {
    inline_keyboard: [
      [
        { text: "Option 1", callback_data: "opt_1" },
        { text: "Option 2", callback_data: "opt_2" }
      ]
    ]
  }
})
```

### Sending Files

#### Sending a Dice

```typescript
await client.execute("send_dice", {
  chat_id: "123456789",
  emoji: "🎲"
})
```

#### Sending a Document

```typescript
await client.execute("send_document", {
  chat_id: "123456789",
  document: {
    file_content: new TextEncoder().encode("Hello from file!"),
    file_name: "hello.txt"
  },
  caption: "Simple text file"
})
```

#### Sending a Photo

```typescript
await client.execute("send_photo", {
  chat_id: "123456789",
  photo: {
    file_content: photoBuffer,
    file_name: "image.jpg"
  },
  caption: "Check out this photo!"
})
```

### Downloading Files

To download a file from Telegram servers, use the `getFile` method. It handles both the API call and file download in one step:

```typescript
// Get file by file_id (from a message, for example)
const file = await client.getFile({
  file_id: "AgACAgIAAxkBAAI..."
})

// file is a standard File object
console.log(file.name) // filename.jpg
console.log(file.size) // file size in bytes

// Read file contents
const arrayBuffer = await file.arrayBuffer()
const text = await file.text()
const blob = await file.blob()
```

### Using Message Effects

The library includes built-in constants for message effects:

```typescript
import { MESSAGE_EFFECTS } from "@effect-ak/tg-bot-client"

await client.execute("send_message", {
  chat_id: "123456789",
  text: "Message with fire effect!",
  message_effect_id: MESSAGE_EFFECTS["🔥"]
})
```

Available effects:
- `MESSAGE_EFFECTS["🔥"]` - Fire
- `MESSAGE_EFFECTS["👍"]` - Thumbs up
- `MESSAGE_EFFECTS["👎"]` - Thumbs down
- `MESSAGE_EFFECTS["❤️"]` - Heart
- `MESSAGE_EFFECTS["🎉"]` - Party
- `MESSAGE_EFFECTS["💩"]` - Poop

## Error Handling

The client throws `TgBotClientError` for all errors:

```typescript
import { TgBotClientError } from "@effect-ak/tg-bot-client"

try {
  await client.execute("send_message", {
    chat_id: "invalid",
    text: "Test"
  })
} catch (error) {
  if (error instanceof TgBotClientError) {
    console.error("Error type:", error.cause._tag)

    switch (error.cause._tag) {
      case "NotOkResponse":
        console.error("API error:", error.cause.errorCode, error.cause.details)
        break
      case "UnexpectedResponse":
        console.error("Unexpected response:", error.cause.response)
        break
      case "ClientInternalError":
        console.error("Internal error:", error.cause.cause)
        break
      case "UnableToGetFile":
        console.error("File download error:", error.cause.cause)
        break
      case "NotJsonResponse":
        console.error("Invalid JSON response:", error.cause.response)
        break
    }
  }
}
```

## API Reference

### `makeTgBotClient(config)`

Creates a new Telegram Bot API client.

**Parameters:**
- `config.bot_token` (string, required): Your bot token from @BotFather
- `config.base_url` (string, optional): Custom API base URL (default: `https://api.telegram.org`)

**Returns:** `TgBotClient`

### `client.execute(method, input)`

Executes a Telegram Bot API method.

**Parameters:**
- `method` (string): API method name in snake_case (e.g., `"send_message"`, `"get_updates"`)
- `input` (object): Method parameters as defined in Telegram Bot API

**Returns:** `Promise<ApiResponse>` - Typed response based on the method

**Note:** Method names use snake_case (e.g., `send_message`) instead of camelCase for better readability and consistency with the Telegram API documentation.

### `client.getFile(input)`

Downloads a file from Telegram servers.

**Parameters:**
- `input.file_id` (string): File identifier from a message

**Returns:** `Promise<File>` - Standard [File](https://developer.mozilla.org/en-US/docs/Web/API/File) object

## Configuration

### Custom Base URL

If you're running your own Telegram Bot API server:

```typescript
const client = makeTgBotClient({
  bot_token: "YOUR_BOT_TOKEN",
  base_url: "https://your-custom-server.com"
})
```

## Related Packages

This package is part of the `tg-bot-client` monorepo:

- **[@effect-ak/tg-bot-api](../api)** - TypeScript types for Telegram Bot API and Mini Apps
- **[@effect-ak/tg-bot](../bot)** - Effect-based bot runner for building Telegram bots
- **[@effect-ak/tg-bot-codegen](../codegen)** - Code generator that parses official documentation

## Contributing

Contributions are welcome! Please check out the [issues](https://github.com/effect-ak/tg-bot-client/issues) or submit a pull request.

## License

MIT © [Aleksandr Kondaurov](https://github.com/effect-ak)
