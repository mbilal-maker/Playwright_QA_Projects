const path = require('path');
const { defineConfig, devices } = require('@playwright/test');

require('dotenv').config();

const authFile = path.resolve(__dirname, 'playwright/.auth/user.json');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['line'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }]
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://rahulshettyacademy.com',
    headless: process.env.HEADLESS === 'true',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.js/
    },
    {
      name: 'google-chrome',
      testIgnore: /.*\.setup\.js/,
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        storageState: authFile
      },
      dependencies: ['setup']
    }
  ],
  outputDir: 'test-results'
});
