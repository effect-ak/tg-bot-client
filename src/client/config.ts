import * as Context from "effect/Context";

import { defaultBaseUrl } from "./const.js";
import { TgBotClientSettingsInput } from "./guards.js";

export type TgBotClientConfigObject = {
  token: string,
  baseUrl: string,
};

export const makeTgBotClientConfig = (
  input: TgBotClientSettingsInput
) => ({
  ...input,
  baseUrl: input.baseUrl ?? defaultBaseUrl
})

export class TgBotClientConfig
  extends Context.Tag("TgBotClientConfig")<TgBotClientConfig, TgBotClientConfigObject>() { }
