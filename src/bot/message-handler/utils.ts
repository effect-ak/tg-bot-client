import type { Update } from "#/specification/types.js";
import { AvailableUpdateTypes } from "./types.js";

export type ExtractedUpdate<K extends AvailableUpdateTypes> = { type: K } & Update[K]

export const extractUpdate =
  <U extends AvailableUpdateTypes>(input: Update) => {

    for (const [field, value] of Object.entries(input) ) {
      if (field == "update_id") {
        continue;
      }
      return {
        type: field,
        ...value
      } as ExtractedUpdate<U>
    }

    return undefined;

  }

