const fs = require('fs');
const path = require('path');
const { test: setup, expect } = require('@playwright/test');

const { ApiClient } = require('../utils/api-client');

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate user through API', async ({ request, page }) => {
  fs.mkdirSync(path.dirname(authFile), { recursive: true });

  const email = process.env.E2E_USER_EMAIL;
  const password = process.env.E2E_USER_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'Missing credentials. Copy .env.example to .env and provide E2E_USER_EMAIL and E2E_USER_PASSWORD.'
    );
  }

  const apiClient = new ApiClient(request);

  const loginResponse = await apiClient.login({
    userEmail: email,
    userPassword: password
  });

  // The application expects its JWT token in localStorage under the key "token".
  // addInitScript runs before the application JavaScript on the first navigation.
  await page.addInitScript(token => {
    window.localStorage.setItem('token', token);
  }, loginResponse.token);

  await page.goto('/client');

  // Confirm that API authentication opened the authenticated dashboard.
  await expect(page.locator('.card-body').first()).toBeVisible();
  await expect(page.locator('#userEmail')).toHaveCount(0);

  // Save cookies, localStorage and other supported browser state.
  await page.context().storageState({ path: authFile });
});
