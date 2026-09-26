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
    baseURL: 'http://127.0.0.1:5173',

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
    // Start Vite automatically when no local server is already running.
    command: 'npm run dev -- --host 127.0.0.1',

    // Playwright waits for this address to respond before testing.
    url: 'http://127.0.0.1:5173',

    // Reuse your running Vite server locally; CI always starts a fresh server.
    reuseExistingServer: !process.env.CI,
  },
})
