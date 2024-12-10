import { ConfigProvider } from "effect"

export const withConfig =
  (input: {
    pagePath: string
  }) =>
    ConfigProvider.fromJson({
      "page-path": input.pagePath,
      "client-out-dir": [ __dirname, "..", "src", "specification" ]
    });
