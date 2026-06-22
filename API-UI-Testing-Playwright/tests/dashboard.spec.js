const { test, expect } = require('@playwright/test');

const { DashboardPage } = require('../pages/dashboard.page');
const { CartPage } = require('../pages/cart.page');

test.describe('Authenticated dashboard operations', () => {
  test.beforeEach(async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.open();
  });

  test('user opens dashboard without UI login', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    await dashboardPage.verifyUserIsAuthenticated();

    const productNames = await dashboardPage.getProductNames();
    expect(productNames.length).toBeGreaterThan(0);
  });

  test('user adds a product to cart from dashboard', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const cartPage = new CartPage(page);
    const productName = 'ZARA COAT 3';

    await dashboardPage.addProductToCart(productName);
    await dashboardPage.openCart();
    await cartPage.verifyProductIsDisplayed(productName);
  });
});
