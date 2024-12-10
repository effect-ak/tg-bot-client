export const MESSAGE_EFFECTS = {
  "🔥": "5104841245755180586",
  "👍": "5107584321108051014",
  "👎": "5104858069142078462",
  "❤️": "5159385139981059251",
  "🎉": "5046509860389126442",
  "💩": "5046589136895476101"
} as const;

export type MessageEffect = keyof typeof MESSAGE_EFFECTS;

export const messageEffectIdCodes = 
  Object.keys(MESSAGE_EFFECTS) as MessageEffect[];

export const isMessageEffect = (input: unknown): input is MessageEffect => {
  return typeof input === "string" && input in MESSAGE_EFFECTS;
}
