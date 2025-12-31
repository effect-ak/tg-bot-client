import { createWebhookHandler } from "@effect-ak/tg-bot"

const token = process.env.TG_BOT_TOKEN

if (!token) {
  throw new Error("TG_BOT_TOKEN environment variable is required")
}

const bot = createWebhookHandler({
  bot_token: token,

  on_message: [
    {
      match: ({ ctx }) => ctx.command === "/start",
      handle: ({ ctx }) => ctx.reply(
        "Welcome! I'm running on Vercel serverless.\n\n" +
        "Commands:\n/dice - roll a dice\n/time - server time\n\n" +
        "Or just send me math like: 2 + 2 + 3"
      )
    },
    {
      match: ({ ctx }) => ctx.command === "/dice",
      handle: ({ ctx }) => ctx.reply(`You rolled: ${Math.floor(Math.random() * 6) + 1}`)
    },
    {
      match: ({ ctx }) => ctx.command === "/time",
      handle: ({ ctx }) => ctx.reply(`Server time: ${new Date().toISOString()}`)
    },
    {
      match: ({ update }) => update.text?.includes("+") ?? false,
      handle: ({ update, ctx }) => {
        const nums = update.text!.match(/\d+/g)
        if (!nums) return ctx.reply("No numbers found")
        const sum = nums.reduce((acc, n) => acc + parseInt(n), 0)
        return ctx.reply(`Sum: ${sum}`)
      }
    },
    {
      match: ({ update }) => !!update.text,
      handle: ({ update, ctx }) => ctx.reply(`Echo: ${update.text}`)
    }
  ],

  on_callback_query: {
    handle: ({ update, ctx }) => {
      console.log("Callback query:", update.data)
      return ctx.reply(`Button: ${update.data}`)
    }
  }
})

// Vercel Edge Function handler
export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 })
  }
  return bot(req)
}

export const config = {
  runtime: "edge"
}
