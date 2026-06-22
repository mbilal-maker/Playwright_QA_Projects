const { test, expect } = require('@playwright/test');
import { defineConfig } from '@playwright/test'
import { promises } from 'node:dns';

test('Open New Window Tab', async function ({ browser }) {

    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    //console.log(await page.title());
    await expect(page).toHaveTitle("LoginPage Practise | Rahul Shetty Academy");

    const documentlink = await page.locator('.blinkingText');

    const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        documentlink.click()
    ]);

    await newPage.waitForLoadState();

    expect(newPage.locator('.inner-box')).toContainText('Documents request');

    



    await page.pause();




});


