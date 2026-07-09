const { test, expect } = require('@playwright/test');

test.describe('Mobile touch/tap actions', () => {
  test.use({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });

  test('uses tap on mobile context', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc/');

    const todoInput = page.getByPlaceholder('What needs to be done?');
    await todoInput.tap();
    await page.keyboard.type('mobile tap action');
    await page.keyboard.press('Enter');

    await expect(page.getByText('mobile tap action')).toBeVisible();
    await page.getByLabel('Toggle Todo').tap();
    await expect(page.locator('.todo-list li')).toHaveClass(/completed/);
  });
});
