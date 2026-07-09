const { test, expect } = require('@playwright/test');

test.describe('Mouse, keyboard, hover, and drag actions', () => {
  test('uses hover', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/hovers');

    await page.locator('.figure').first().hover();
    await expect(page.getByText('name: user1')).toBeVisible();
  });

  test('uses mouse click, keyboard press, keyboard type, keyboard down, and keyboard up', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/key_presses');

    const target = page.locator('#target');
    const box = await target.boundingBox();
    if (!box) throw new Error('Target input bounding box was not found.');

    await page.mouse.move(box.x + 20, box.y + 20);
    await page.mouse.click(box.x + 20, box.y + 20);

    await page.keyboard.press('A');
    await expect(page.locator('#result')).toContainText('You entered: A');

    await page.keyboard.down('Shift');
    await page.keyboard.press('B');
    await page.keyboard.up('Shift');
    await expect(page.locator('#result')).toContainText('You entered: B');
  });

  test('uses mouse wheel and scrollIntoViewIfNeeded', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/infinite_scroll');

    await page.mouse.wheel(0, 1200);
    await page.locator('.jscroll-added').first().waitFor({ state: 'visible' });

    await page.locator('.jscroll-added').last().scrollIntoViewIfNeeded();
    await expect(page.locator('.jscroll-added').first()).toBeVisible();
  });

  test('uses dragTo inside iframe with frameLocator', async ({ page }) => {
    await page.goto('https://jqueryui.com/droppable/');

    const frame = page.frameLocator('.demo-frame');
    await frame.locator('#draggable').dragTo(frame.locator('#droppable'));

    await expect(frame.locator('#droppable')).toContainText('Dropped!');
  });
});
