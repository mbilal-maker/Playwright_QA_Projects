const { expect } = require('@playwright/test');

class OrdersPage {
  constructor(page) {
    this.page = page;
    this.ordersTable = page.locator('tbody');
    this.orderRows = page.locator('tbody tr');
  }

  async verifyOpened() {
    await expect(this.page).toHaveURL(/myorders/i);
    await expect(this.ordersTable).toBeVisible();
  }

  async getOrderCount() {
    await this.ordersTable.waitFor();
    return this.orderRows.count();
  }
}

module.exports = { OrdersPage };
