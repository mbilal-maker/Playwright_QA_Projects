const { test, expect } = require('@playwright/test');

const STANDARD_USER = 'standard_user';
const LOCKED_USER = 'locked_out_user';
const PASSWORD = 'secret_sauce';

const screenshotOptions = {
  fullPage: true,
  animations: 'disabled',
  caret: 'hide',
};

async function waitForVisualStability(page) {
  await page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    const images = Array.from(document.images);
    await Promise.all(
      images.map((image) => {
        if (image.complete) return Promise.resolve();
        return new Promise((resolve) => {
          image.addEventListener('load', resolve, { once: true });
          image.addEventListener('error', resolve, { once: true });
        });
      })
    );
  });
}

async function openLoginPage(page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  await waitForVisualStability(page);
}

async function login(page, username = STANDARD_USER, password = PASSWORD) {
  await openLoginPage(page);
  await page.locator('[data-test="username"]').fill(username);
  await page.locator('[data-test="password"]').fill(password);
  await page.locator('[data-test="login-button"]').click();

  await expect(page).toHaveURL(/inventory\.html$/);
  await expect(page.locator('[data-test="title"]')).toHaveText('Products');
  await waitForVisualStability(page);
}

async function addDynamicTimestamp(page) {
  await page.evaluate(() => {
    const previous = document.querySelector('[data-test="visual-timestamp"]');
    if (previous) previous.remove();

    const element = document.createElement('div');
    element.dataset.test = 'visual-timestamp';
    element.textContent = `Last updated: ${new Date().toISOString()}`;
    element.style.cssText = [
      'position:fixed',
      'right:16px',
      'bottom:16px',
      'z-index:9999',
      'width:280px',
      'height:40px',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'background:#fff',
      'border:1px solid #999',
      'border-radius:6px',
      'font:14px Arial,sans-serif',
      'color:#222',
    ].join(';');
    document.body.appendChild(element);
  });
}

test.describe('Scenario 15 - SauceDemo visual regression', () => {
  test('compare the login page screenshot', async ({ page }) => {
    await openLoginPage(page);
    await expect(page).toHaveScreenshot('login-page.png', screenshotOptions);
  });

  test('compare the dashboard inventory screenshot', async ({ page }) => {
    await login(page);
    await expect(page).toHaveScreenshot('inventory-dashboard.png', screenshotOptions);
  });

  test('compare an empty state', async ({ page }) => {
    await login(page);
    await page.locator('[data-test="shopping-cart-link"]').click();

    await expect(page).toHaveURL(/cart\.html$/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Your Cart');
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(0);

    await expect(page).toHaveScreenshot('empty-cart-state.png', screenshotOptions);
  });

  test('compare an invalid-login error state', async ({ page }) => {
    await openLoginPage(page);
    await page.locator('[data-test="username"]').fill('invalid_user');
    await page.locator('[data-test="password"]').fill('invalid_password');
    await page.locator('[data-test="login-button"]').click();

    const error = page.locator('[data-test="error"]');
    await expect(error).toContainText('Username and password do not match');
    await expect(page).toHaveScreenshot('invalid-login-error.png', screenshotOptions);
  });

  test('compare desktop and mobile versions', async ({ page }) => {
    await login(page);
    await expect(page).toHaveScreenshot('responsive-inventory.png', screenshotOptions);
  });

  test('mask a dynamic timestamp', async ({ page }) => {
    await login(page);
    await addDynamicTimestamp(page);

    const timestamp = page.locator('[data-test="visual-timestamp"]');
    await expect(timestamp).toBeVisible();

    await expect(page).toHaveScreenshot('masked-timestamp.png', {
      ...screenshotOptions,
      mask: [timestamp],
      maskColor: '#D0D5DD',
    });
  });

  test('mask a username', async ({ page }) => {
    await openLoginPage(page);

    const username = page.locator('[data-test="username"]');
    await username.fill(`visual_user_${Date.now()}`);
    await page.locator('[data-test="password"]').fill(PASSWORD);

    await expect(page).toHaveScreenshot('masked-username.png', {
      ...screenshotOptions,
      mask: [username],
      maskColor: '#D0D5DD',
    });
  });

  test('verify only a specific component', async ({ page }) => {
    await login(page);

    const productCard = page.locator('[data-test="inventory-item"]').first();
    await expect(productCard).toBeVisible();

    await expect(productCard).toHaveScreenshot('inventory-product-card.png', {
      animations: 'disabled',
      caret: 'hide',
      mask: [productCard.locator('[data-test="inventory-item-price"]')],
      maskColor: '#D0D5DD',
    });
  });

  test('handle an expected animation', async ({ page }) => {
    await login(page);
    await page.getByRole('button', { name: 'Open Menu' }).click();

    const menu = page.locator('.bm-menu-wrap');
    await expect(menu).toBeVisible();

    await expect(menu).toHaveScreenshot('side-menu-animation-disabled.png', {
      animations: 'disabled',
      caret: 'hide',
    });
  });

  test('compare a locked-user error state', async ({ page }) => {
    await openLoginPage(page);
    await page.locator('[data-test="username"]').fill(LOCKED_USER);
    await page.locator('[data-test="password"]').fill(PASSWORD);
    await page.locator('[data-test="login-button"]').click();

    const error = page.locator('[data-test="error"]');
    await expect(error).toContainText('Sorry, this user has been locked out');
    await expect(page).toHaveScreenshot('locked-user-error.png', screenshotOptions);
  });
});
