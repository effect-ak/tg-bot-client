import { Effect, Micro, pipe } from "effect"
import { launchBot } from "@effect-ak/tg-bot"

import { loadConfig } from "../config"

const config = await loadConfig()

Effect.gen(function* () {
  const bot = yield* launchBot({
    bot_token: config.token,
    mode: "single",
    poll: {
      log_level: "debug",
      max_empty_responses: 3
    },
    on_message: [
      {
        match: ({ update }) => !!update.text,
        handle: ({ ctx }) => ctx.reply("hello!!!")
      }
    ]
  })

  yield* pipe(
    Micro.fiberAwait(bot.fiber()!),
    Effect.andThen(Effect.logInfo("done")),
    Effect.forkDaemon
  )
}).pipe(Effect.runPromise)
