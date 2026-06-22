const fs = require('fs');
const path = require('path');
const { test: setup, expect } = require('@playwright/test');
const { ApiClient } = require('../utils/api-client');

const authFile = path.resolve(__dirname, '../playwright/.auth/user.json');

setup('authenticate once through API', async ({ request }) => {
  const email = process.env.E2E_USER_EMAIL;
  const password = process.env.E2E_USER_PASSWORD;
  const baseURL = process.env.BASE_URL || 'https://rahulshettyacademy.com';

  expect(email, 'E2E_USER_EMAIL is missing from .env').toBeTruthy();
  expect(password, 'E2E_USER_PASSWORD is missing from .env').toBeTruthy();

  const apiClient = new ApiClient(request);
  const loginResponse = await apiClient.login({
    userEmail: email,
    userPassword: password
  });

  fs.mkdirSync(path.dirname(authFile), { recursive: true });

  const origin = new URL(baseURL).origin;
  const storageState = {
    cookies: [],
    origins: [
      {
        origin,
        localStorage: [
          { name: 'token', value: loginResponse.token }
        ]
      }
    ]
  };

  fs.writeFileSync(authFile, JSON.stringify(storageState, null, 2), 'utf8');
});
