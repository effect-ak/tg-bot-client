import * as Context from "effect/Context";

import { defaultBaseUrl } from "../const.js";
import { TgBotClientSettingsInput } from "./guards.js";

export type TgBotClientConfigObject =
  Required<TgBotClientSettingsInput>;

export const makeTgBotClientConfig = (
  input: TgBotClientSettingsInput
) =>
  TgBotClientConfig.of({
    ...input,
    ["base-url"]: input["base-url"] ?? defaultBaseUrl
  });

export class TgBotClientConfig
  extends Context.Tag("TgBotClientConfig")<TgBotClientConfig, TgBotClientConfigObject>() { }