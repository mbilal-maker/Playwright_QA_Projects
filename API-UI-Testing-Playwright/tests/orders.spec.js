const { test, expect } = require('@playwright/test');

const { DashboardPage } = require('../pages/dashboard.page');
const { OrdersPage } = require('../pages/orders.page');

test('authenticated user opens order history from dashboard', async ({ page }) => {
  const dashboardPage = new DashboardPage(page);
  const ordersPage = new OrdersPage(page);

  await dashboardPage.open();
  await dashboardPage.openOrders();
  await ordersPage.verifyOpened();

  const orderCount = await ordersPage.getOrderCount();
  expect(orderCount).toBeGreaterThanOrEqual(0);
});
