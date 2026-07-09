const { test, expect } = require('@playwright/test');

test.describe('The Internet - checkbox and dropdown actions', () => {
  test('uses check, uncheck, setChecked, and isChecked', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/checkboxes');

    const firstCheckbox = page.locator('input[type="checkbox"]').first();
    const secondCheckbox = page.locator('input[type="checkbox"]').nth(1);

    await firstCheckbox.check();
    await expect(firstCheckbox).toBeChecked();

    await firstCheckbox.uncheck();
    await expect(firstCheckbox).not.toBeChecked();

    await secondCheckbox.setChecked(false);
    expect(await secondCheckbox.isChecked()).toBe(false);

    await secondCheckbox.setChecked(true);
    await expect(secondCheckbox).toBeChecked();
  });

  test('uses selectOption on dropdown', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/dropdown');

    const dropdown = page.locator('#dropdown');
    await dropdown.selectOption({ label: 'Option 2' });
    await expect(dropdown).toHaveValue('2');

    await dropdown.selectOption('1');
    await expect(dropdown).toHaveValue('1');
  });
});
