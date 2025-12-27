# Telegram Bot TypeScript SDK

Type-safe TypeScript SDK for building Telegram bots, automatically generated from official Telegram Bot API documentation.

## 📦 Packages

This monorepo contains three packages:

### [@effect-ak/tg-bot-api](./packages/api)
TypeScript types for Telegram Bot API and Mini Apps, auto-generated from official documentation.

### [@effect-ak/tg-bot-client](./packages/client)
Lightweight HTTP client for Telegram Bot API with full type safety.

### [@effect-ak/tg-bot](./packages/bot)
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
