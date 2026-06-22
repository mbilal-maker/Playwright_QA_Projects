const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('../pages/dashboard.page');
const { CartPage } = require('../pages/cart.page');

test.describe('API-authenticated dashboard', () => {
  test.beforeEach(async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.open();
  });

  test('opens dashboard without UI login', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    await dashboardPage.verifyAuthenticated();

    const productNames = await dashboardPage.getProductNames();
    expect(productNames.length).toBeGreaterThan(0);
  });

  test('adds a product to the cart', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const cartPage = new CartPage(page);
    const productName = 'ZARA COAT 3';

    await dashboardPage.addProductToCart(productName);
    await dashboardPage.openCart();
    await cartPage.verifyProductIsDisplayed(productName);
  });
});
