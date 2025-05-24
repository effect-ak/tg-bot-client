import { Message } from "#/client";

export function extractCommand(message: Message) {

  const commandEntity = message.entities?.find(_ => _.type == "bot_command")
  if (!commandEntity || !message.text || commandEntity.offset != 0) return

  const name = message.text.slice(0, commandEntity.length)
  const args = message.text.slice(commandEntity.length + 1)

  return {
    name, args
  } as const
}