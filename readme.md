# Telegram Bot TypeScript SDK

Type-safe TypeScript SDK for building Telegram bots, automatically generated from official Telegram Bot API documentation.

## 📦 Packages

This monorepo contains three packages:

### [@effect-ak/tg-bot-api](./packages/api)

![Telegram Bot API](https://img.shields.io/badge/BotApi-9.2-blue)
![Telegram WebApp](https://img.shields.io/badge/Telegram.WebApp-9.1-blue)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.1-blue.svg)](https://effect-ak.github.io/telegram-bot-api/)

TypeScript types for Telegram Bot API and Mini Apps, auto-generated from official documentation.

### [@effect-ak/tg-bot-client](./packages/client)

[![NPM Version](https://img.shields.io/npm/v/%40effect-ak%2Ftg-bot-client)](https://www.npmjs.com/package/@effect-ak/tg-bot-client)
![NPM Unpacked Size](https://img.shields.io/npm/unpacked-size/%40effect-ak%2Ftg-bot-client)
![NPM Downloads](https://img.shields.io/npm/dw/%40effect-ak%2Ftg-bot-client)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Lightweight HTTP client for Telegram Bot API with full type safety.

### [@effect-ak/tg-bot](./packages/bot)

[![NPM Version](https://img.shields.io/npm/v/%40effect-ak%2Ftg-bot)](https://www.npmjs.com/package/@effect-ak/tg-bot)
![NPM Downloads](https://img.shields.io/npm/dw/%40effect-ak%2Ftg-bot)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Effect-based bot runner with automatic long polling and error handling.

## 🎯 Key Features

- **Always Up-to-Date**: Types generated from official Telegram API documentation
- **Fully Type-Safe**: Complete TypeScript support for all API methods and types
- **Zero Config**: Works out of the box with sensible defaults
- **Effect Integration**: Optional Effect.js support for advanced async patterns
- **No Webhooks Required**: Uses long polling - run anywhere without public URLs

## 📚 Documentation

Each package has its own detailed documentation:

- [API Types Documentation](./packages/api) - TypeScript types for Bot API and Mini Apps
- [Client Documentation](./packages/client) - HTTP client usage and examples
- [Bot Runner Documentation](./packages/bot) - Building bots with handlers and polling

## 🎮 Playground

Try it in your browser: **[Telegram Bot Playground](https://effect-ak.github.io/telegram-bot-playground/)**

## 🛠️ Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Format code
pnpm format:fix
```
