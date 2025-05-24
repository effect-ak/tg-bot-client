import { build, Options } from "tsup"

const common: Options = {
  outDir: "dist",
  format: ["esm", "cjs"],
  splitting: false,
  sourcemap: false,
  minify: true,
  dts: true
}

await build({
  entry: {
    index: "src/index.ts",
    bot: "src/bot/index.ts",
    webapp: "src/webapp/index.ts"
  },
  ...common,
  clean: true
})

// bot module with dependencies
await build({
  entry: {
    "bot-bundle": "src/bot/index.ts",
  },
  ...common,
  noExternal: [
    "effect"
  ]
})
