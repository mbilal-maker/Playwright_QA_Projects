const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('File upload, dialog, popup, and element screenshot actions', () => {
  test('uses setInputFiles for file upload', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/upload');

    const filePath = path.join(__dirname, '../test-data/upload-sample.txt');
    await page.locator('#file-upload').setInputFiles(filePath);
    await page.locator('#file-submit').click();

    await expect(page.locator('h3')).toHaveText('File Uploaded!');
    await expect(page.locator('#uploaded-files')).toContainText('upload-sample.txt');
  });

  test('uses dialog accept', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/javascript_alerts');

    page.once('dialog', async dialog => {
      expect(dialog.message()).toContain('I am a JS Alert');
      await dialog.accept();
    });

    await page.getByText('Click for JS Alert').click();
    await expect(page.locator('#result')).toHaveText('You successfully clicked an alert');
  });

  test('uses popup/new tab handling', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/windows');

    const popupPromise = page.waitForEvent('popup');
    await page.getByText('Click Here').click();
    const popup = await popupPromise;

    await expect(popup.locator('h3')).toHaveText('New Window');
    await popup.close();
  });

  test('uses locator screenshot', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    await page.locator('.login-box').screenshot({ path: 'screenshots/login-box.png' });
  });
});
