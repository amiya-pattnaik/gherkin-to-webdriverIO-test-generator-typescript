import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/__tests__/**/*.test.ts'], // only test inside src/__tests__
    exclude: ['test/specs/**'],              // ignore WebdriverIO specs
  },
});
