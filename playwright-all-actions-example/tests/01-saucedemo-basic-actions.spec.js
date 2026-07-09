const { test, expect } = require('@playwright/test');

test.describe('SauceDemo - basic locator, form, navigation, and screenshot actions', () => {
  test('uses goto, focus, fill, clear, pressSequentially, click, selectOption, goBack, goForward, and screenshot', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    const username = page.locator('[data-test="username"]');
    const password = page.locator('[data-test="password"]');
    const loginButton = page.locator('[data-test="login-button"]');

    await username.focus();
    await username.fill('wrong_user');
    await username.clear();
    await username.pressSequentially('standard_user', { delay: 20 });

    await password.fill('secret_sauce');
    await loginButton.click();

    await expect(page).toHaveURL(/inventory/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');

    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');

    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/cart/);
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack');

    await page.goBack();
    await expect(page).toHaveURL(/inventory/);

    await page.goForward();
    await expect(page).toHaveURL(/cart/);

    await page.screenshot({ path: 'screenshots/saucedemo-cart-page.png', fullPage: true });
  });
});
