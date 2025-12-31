import { defineConfig } from "tsup"
import { config } from "dotenv"

config()

export default defineConfig({
  entry: ["api/vercel-tg-webhook.ts"],
  format: ["esm"],
  outDir: "dist/api",
  noExternal: [/@effect-ak/],
  splitting: false,
  clean: true,
  define: {
    "process.env.TOKEN": JSON.stringify(process.env.TOKEN)
  }
})
