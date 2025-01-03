import { ConfigProvider } from "effect"

export const withConfig =
  (input: {
    pagePath: string
  }) =>
    ConfigProvider.fromJson({
      "page-path": input.pagePath,
      "scrapper-out-dir": [ __dirname, "..", "src", "specification" ],
      "openapi-out-dir": [ __dirname, "..", "openapi" ],
    });
