export const methodPath =
  (methodName: string) =>
    methodName
      .split("_")
      .reduce((result, word, step) => {
        if (step == 0) {
          return word
        } else {
          return result + word.at(0)?.toUpperCase() + word.slice(1);
        }
      }, "");

type FileProps = { file_content: Uint8Array, file_name: string }

const hasFileContent =
  (input: unknown): input is FileProps =>
    (typeof input == "object" && input != null) &&
    ("file_content" in input && input.file_content instanceof Uint8Array) &&
    ("file_name" in input && typeof input.file_name === "string" && input.file_name.length > 0)

export const makePayload = (
  body: Record<string, unknown>
): FormData | undefined => {

  const entries = Object.entries(body);

  if (entries.length == 0) return undefined;

  const result = new FormData();

  for (const [key, value] of entries) {
    if (!value) continue;

    if (typeof value != "object") {
      result.append(key, `${value}`)
    } else if (hasFileContent(value)) {
      result.append(key, new Blob([ value.file_content ]), value.file_name);
    } else {
      result.append(key, JSON.stringify(value))  
    }

  }

  return result;
}
