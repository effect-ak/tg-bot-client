/**
 * This module provides utility functions for working with arrays in TypeScript.
 *
 * @since 2.0.0
 */


import { isFileContent } from "../guards.js";

/**
 * @category utils
 * @since 2.0.0
 */
export const makePayload = (
  body: object
): FormData | undefined => {

  const entries = Object.entries(body);

  if (entries.length == 0) return undefined;

  const result = new FormData();

  for (const [key, value] of entries) {
    if (!value) continue;

    if (typeof value != "object") {
      result.append(key, `${value}`)
    } else if (isFileContent(value)) {
      result.append(key, new Blob([value.file_content]), value.file_name);
    } else {
      result.append(key, JSON.stringify(value))
    }

  }

  return result;
}
