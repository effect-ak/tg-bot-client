import { defineConfig } from 'vitest/config';
import config from "./config.json" assert { type: "json" };
export default defineConfig({
    test: {
        testTimeout: 30000,
        env: {
            ...config
        }
    }
});
