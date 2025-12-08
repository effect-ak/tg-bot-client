// Regex to match text within “ ” or " "
const regexQuotes = /["“]([^"”]+)["”]/g
const regexFallback =
  /(?:must be|always|can be)\s+(?:one\s+of\s+)?["“]?([^"”.,]+)["”]?/i
const enumRegex = /^[A-Za-z0-9_/\p{Emoji}\u200D]+$/u

const enumPresenceIndicatiors = ["must be", "always", "one of", "can be"]

const hasEnum = (line: string) =>
  enumPresenceIndicatiors.map((_) => line.includes(_)).includes(true)

export function extractEnumFromTypeDescription(
  description: string[]
): string[] {
  const enumValues: string[] = []

  for (const line of description) {
    if (!line || !hasEnum(line)) continue

    let match
    while ((match = regexQuotes.exec(line)) !== null) {
      enumValues.push(
        ...match[1].split(/",\s*|”,\s*|“|”|,/).map((s) => s.trim())
      )
    }

    if (enumValues.length === 0) {
      const fallbackMatch = regexFallback.exec(line)
      if (fallbackMatch) {
        enumValues.push(
          ...fallbackMatch[1].split(/,\s*|or\s+/).map((s) => s.trim())
        )
      }
    }
  }

  return enumValues.filter((_) => enumRegex.test(_))
}
