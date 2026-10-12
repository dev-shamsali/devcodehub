import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.js',
  fullyParallel: true,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3100',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev -- --port 3100',
    url: 'http://localhost:3100/login',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    env: {
      // ImageKit/Mongo calls are mocked in the tests via page.route. The
      // session cookie is signed with this secret (see tests/upload.spec.js).
      AUTH_SECRET: 'playwright-test-secret-not-for-production',
      NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: 'https://ik.imagekit.io/test',
      NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY: 'public_test_key',
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
