import * as Context from "effect/Context"

import { TG_BOT_API_URL } from "./const"

export class TgBotApiBaseUrl extends Context.Reference<TgBotApiBaseUrl>()(
  "TgBotApiBaseUrl",
  { defaultValue: () => TG_BOT_API_URL }
) {}

export class TgBotApiToken extends Context.Tag("TgBotApiToken")<
  TgBotApiToken,
  string
>() {}
