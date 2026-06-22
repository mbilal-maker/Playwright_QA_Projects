const { expect } = require('@playwright/test');

class OrdersPage {
  constructor(page) {
    this.page = page;
    this.title = page.getByRole('heading', { name: /your orders/i });
    this.orderRows = page.locator('tbody tr');
  }

  async verifyOpened() {
    await expect(this.page).toHaveURL(/myorders/);
    await expect(this.title).toBeVisible();
  }

  async getOrderCount() {
    return this.orderRows.count();
  }
}

module.exports = { OrdersPage };
