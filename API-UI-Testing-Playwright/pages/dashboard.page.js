const { expect } = require('@playwright/test');

class DashboardPage {
  constructor(page) {
    this.page = page;
    this.productCards = page.locator('.card-body');
    this.productNames = page.locator('.card-body b');
    this.cartButton = page.locator("[routerlink*='cart']");
    this.ordersButton = page.locator("button[routerlink*='myorders']");
    this.signOutButton = page.getByRole('button', { name: /sign out/i });
  }

  async open() {
    await this.page.goto('/client');
    await expect(this.productCards.first()).toBeVisible();
  }

  async verifyUserIsAuthenticated() {
    await expect(this.productCards.first()).toBeVisible();
    await expect(this.page.locator('#userEmail')).toHaveCount(0);
  }

  async getProductNames() {
    return this.productNames.allTextContents();
  }

  async addProductToCart(productName) {
    const productCard = this.productCards.filter({
      has: this.page.locator('b', { hasText: productName })
    });

    await expect(productCard).toHaveCount(1);
    await productCard.getByText('Add To Cart', { exact: false }).click();
  }

  async openCart() {
    await this.cartButton.click();
  }

  async openOrders() {
    await this.ordersButton.click();
  }
}

module.exports = { DashboardPage };
