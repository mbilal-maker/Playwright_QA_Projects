const { test, expect } = require('@playwright/test');
import { defineConfig } from '@playwright/test'

test('First Test', async function ({ browser }) {

    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    //console.log(await page.title());
    await expect(page).toHaveTitle("LoginPage Practise | Rahul Shetty Academy");
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#signInBtn')).toBeVisible();
    await expect(page.getByText('Username:')).toBeVisible();
    await expect(page.getByText('Password:')).toBeVisible();
    // Radio buttons
    await expect(page.locator('input[value="admin"]')).toBeChecked();
    await expect(page.locator('input[value="user"]')).toBeVisible();

    // Dropdown
    await expect(page.locator('select')).toBeVisible();

    // Terms checkbox
    await expect(page.locator('#terms')).toBeVisible();

// when user name and password is empty then verify allert message 

// Leave username & password empty
  await page.fill('#username', '');
  await page.fill('#password', '');

  // Click login
  await page.click('#signInBtn');

  const alertMsg = page.locator('.alert-danger');

  // Verify alert is visible
  await expect(alertMsg).toBeVisible();

  // Verify exact error message text (HTML aware)
  await expect(alertMsg).toContainText('Empty username/password.');

  // Verify alert disappears after 2 seconds
  await expect(alertMsg).toBeHidden({ timeout: 3000 });


});