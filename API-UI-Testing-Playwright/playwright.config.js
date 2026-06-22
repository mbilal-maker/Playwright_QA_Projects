const path = require('path');
const { defineConfig, devices } = require('@playwright/test');

require('dotenv').config();

const authFile = path.join(
  __dirname,
  'playwright/.auth/user.json'
);

module.exports = defineConfig({
  testDir: './tests',

  timeout: 60_000,

  expect: {
    timeout: 15_000
  },

  fullyParallel: false,

  forbidOnly: Boolean(process.env.CI),

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['line'],
    [
      'html',
      {
        outputFolder: 'playwright-report',
        open: 'never'
      }
    ]
  ],

  use: {
    baseURL:
      process.env.BASE_URL ||
      'https://rahulshettyacademy.com',

    // Launch the Google Chrome installed on the laptop.
    channel: 'chrome',

    // Display the Chrome browser during execution.
    headless: false,

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

      use: {
        ...devices['Desktop Chrome'],

        // Reuse authentication generated through the API.
        storageState: authFile
      },

      dependencies: ['setup']
    }
  ],

  outputDir: 'test-results'
});