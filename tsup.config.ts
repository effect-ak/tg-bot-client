import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: "dist",
  format: ["esm", "cjs"],
  splitting: false,
  sourcemap: false,
  clean: true,
  dts: true
})