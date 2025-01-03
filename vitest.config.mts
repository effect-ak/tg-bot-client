import { defineConfig } from 'vitest/config'
import tsconfigPaths from "vite-tsconfig-paths"

import config from "./config.json" assert { type: 'json' };

export default defineConfig({
  plugins: [
    tsconfigPaths()
  ],
  test: {
    testTimeout: 30000,
    env: {
      ...config
    }
  }
});
