import { defineConfig } from 'vitest/config';

// The engine tests are pure TypeScript (no JSX/DOM), so this config deliberately
// loads no Vite plugins. When we add React component tests (slice 2) we'll switch
// `environment` to 'jsdom' and pull in the react plugin.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
