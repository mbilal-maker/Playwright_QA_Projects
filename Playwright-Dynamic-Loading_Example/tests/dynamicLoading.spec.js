const { test, expect } = require('@playwright/test');

test('Example 1 - hidden element loader', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/dynamic-loading/1', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  await page.getByRole('button', { name: 'Start' }).click();

  await expect(page.locator('#loading')).toBeVisible();
  await expect(page.locator('#loading')).toBeHidden({ timeout: 15000 });
  await expect(page.locator('#finish')).toHaveText('Hello World!');
});

test('Example 2 - element created after loading', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/dynamic-loading/2', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  await page.getByRole('button', { name: 'Start' }).click();

  await expect(page.locator('#loading')).toBeVisible();
  await expect(page.locator('#loading')).toBeHidden({ timeout: 15000 });
  await expect(page.locator('#finish')).toContainText('Hello World!');
});