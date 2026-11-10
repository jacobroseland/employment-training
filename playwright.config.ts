import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',

  // Run test files in parallel when possible.
  fullyParallel: true,

  // Fail CI if a focused test was accidentally committed.
  forbidOnly: !!process.env.CI,

  // Retry flaky browser tests only in CI.
  retries: process.env.CI ? 2 : 0,

  // Keep CI output predictable.
  workers: process.env.CI ? 1 : undefined,

  // Create an HTML report after each run.
  reporter: 'html',

  use: {
    // Allows tests to use relative paths such as page.goto('/').
    baseURL: 'http://127.0.0.1:5174',

    // Save a trace if a test fails and is retried.
    trace: 'on-first-retry',
  },

  // Start with one browser while we learn the workflow.
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    // Browser tests intercept the draft API, so they need only the Vite client.
    command:
      'VITE_SUPABASE_URL= VITE_SUPABASE_PUBLISHABLE_KEY= npm run dev:client -- --host 127.0.0.1 --port 5174',

    // Playwright waits for this address to respond before testing.
    url: 'http://127.0.0.1:5174',

    // Use an isolated app server with auth configuration disabled so browser
    // journeys stay deterministic and do not depend on a personal session.
    reuseExistingServer: false,
  },
})
