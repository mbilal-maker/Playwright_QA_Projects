const { test, expect } = require('@playwright/test');
import { defineConfig } from '@playwright/test'

test('First Test', async function ({ browser }) {

    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    //console.log(await page.title());
    await expect(page).toHaveTitle("LoginPage Practise | Rahul Shetty Academy");
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#signInBtn')).toBeVisible();
    await expect(page.getByText('Username:')).toBeVisible();
    await expect(page.getByText('Password:')).toBeVisible();
    // Radio buttons
    await expect(page.locator('input[value="admin"]')).toBeChecked();
    await expect(page.locator('input[value="user"]')).toBeVisible();

    // Dropdown
    await expect(page.locator('select')).toBeVisible();

    // Terms checkbox
    await expect(page.locator('#terms')).toBeVisible();

    // when user name and password is empty then verify allert message  (Alert_Message file)

    // Step 1: Capture the credentials text
    const credentialsText = await page
        .locator('.form-group p')
        .textContent();

    if (!credentialsText) {
        throw new Error('Credentials text not found');
    }
    // Step 2: Extract username and password using regex
    const usernameMatch = credentialsText.match(/username is\s+(.*)\s+and/i);
    const passwordMatch = credentialsText.match(/Password is\s+(.*)\)/i);
    // Step 3: Fail test if credentials are not found
    if (!usernameMatch || !passwordMatch) {
        throw new Error('Username or Password not found in UI text');
    }

    const username = usernameMatch[1].trim();
    const password = passwordMatch[1].trim();
    // Step 4: Fill login form dynamically
    await page.fill('#username', username);
    await page.fill('#password', password);

    await page.check('#terms');

    await page.click('#signInBtn');

    // Redirect verification
    await expect(page).toHaveURL(
        'https://rahulshettyacademy.com/angularpractice/shop'
    );


    await page.getByRole('link', { name: 'Shop' }).click();

    const products = page.locator('.card'); // all product cards
    const productCount = await products.count();

    for (let i = 0; i < productCount; i++) {
        const productCard = products.nth(i);
        const productName = await productCard.locator('.card-body a').textContent();

        if (productName?.trim() === 'iphone X') {
            await productCard.getByRole('button', { name: 'Add' }).click();
            break; // stop after adding the first match
        }
    }

    await page.pause();




});


