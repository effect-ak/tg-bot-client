import { ConfigProvider } from "effect"
import { dirname } from "path";
import { fileURLToPath } from "url"

const filePath = fileURLToPath(import.meta.url);
const currentPath = dirname(filePath);

export const withConfig =
  (input: {
    pagePath: string
  }) =>
    ConfigProvider.fromJson({
      "page-path": input.pagePath,
      "scrapper-out-dir": [ currentPath, "..", "src", "specification" ],
      "openapi-out-dir": [ currentPath, "..", "openapi" ],
    });
