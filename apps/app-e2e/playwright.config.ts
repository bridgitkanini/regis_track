import { defineConfig, devices } from '@playwright/test';
import { nxE2EPreset } from '@nx/playwright/preset';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const baseURL = process.env['BASE_URL'] || 'http://localhost:4200';

// See https://playwright.dev/docs/test-configuration.
export default defineConfig({
  ...nxE2EPreset(__filename, { testDir: './src' }),
  // Shared settings for all the projects below.
  use: {
    // Base URL to use in actions like `await page.goto('/')`.
    baseURL,
    // Collect trace when retrying the failed test.
    trace: 'on-first-retry',
    // Capture screenshot after each test failure.
    screenshot: 'only-on-failure',
    // Record video only when retrying for the first time.
    video: 'on-first-retry',
  },
  // Run your local dev server before starting the tests.
  webServer: {
    command: 'npx nx serve app',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
  },
  // Configure projects for major browsers.
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Mobile viewport testing
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  // Run all tests in parallel.
  fullyParallel: true,
  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,
  // Retry on CI only.
  retries: process.env.CI ? 2 : 0,
  // Opt out of parallel tests on CI.
  workers: process.env.CI ? 1 : undefined,
  // Reporter to use
  reporter: [
    ['html', { outputFolder: 'test-results/html' }],
    ['list'],
    ['github'],
  ],
});
