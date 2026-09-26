import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3100',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev -- --port 3100',
    // Health-checks /media, not /, because / renders the Codes editor which
    // needs real Firebase credentials this environment does not have.
    url: 'http://localhost:3100/media',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    env: {
      // /media never touches Firebase, so these can stay unset for the
      // upload e2e tests. ImageKit/Mongo calls are mocked in the tests
      // themselves via page.route.
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
