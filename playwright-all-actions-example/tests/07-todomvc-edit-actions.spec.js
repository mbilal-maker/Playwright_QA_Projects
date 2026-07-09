const { test, expect } = require('@playwright/test');

test.describe('TodoMVC - edit actions', () => {
  test('uses dblclick, blur, press, and locator waitFor', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc/');

    const todoInput = page.getByPlaceholder('What needs to be done?');
    await todoInput.fill('Old Task');
    await todoInput.press('Enter');

    await page.getByText('Old Task').dblclick();

    const editInput = page.locator('.todo-list li.editing .edit');
    await editInput.waitFor({ state: 'visible' });
    await editInput.fill('Updated Task');
    await editInput.press('Enter');

    await expect(page.getByText('Updated Task')).toBeVisible();

    await page.getByText('Updated Task').dblclick();
    await editInput.fill('Updated Task After Blur');
    await editInput.blur();

    await expect(page.getByText('Updated Task After Blur')).toBeVisible();
  });
});
