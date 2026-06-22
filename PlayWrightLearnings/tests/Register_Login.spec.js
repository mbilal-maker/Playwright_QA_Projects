const { test, expect } = require('@playwright/test');
import { defineConfig } from '@playwright/test'

test('Register and Login', async function ({ browser, page }) {

    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    const email="testsjhzdf12@gmail.com";
    await expect(page.locator('.btn1')).toBeVisible();
    await page.locator('.btn1').click();
    await page.fill('#firstName', 'Muhammad1');
    await page.fill('#lastName', 'Bilal1');
    const email1= page.locator('#userEmail');
    await email1.fill(email);
    
    await page.fill('#userMobile', '2020202030');

    const occupationDropdown = page.locator('select[formcontrolname="occupation"]');
    await expect(occupationDropdown).toBeEnabled();
    await occupationDropdown.selectOption({ label: 'Engineer' });
    await expect(occupationDropdown).toHaveValue('3: Engineer');


    const maleRadio = page.locator('input[type="radio"][formcontrolname="gender"][value="Male"]');
    await maleRadio.waitFor({ state: 'visible' });
    await maleRadio.check();
    await expect(maleRadio).toBeChecked();
    const password='Allison@12';
    const password1 = await page.locator('#userPassword', );
    await password1.fill(password);
    const confirmPass= await page.locator('#confirmPassword');
    await confirmPass.fill(password);
    const requiredCheckbox = page.locator('input[type="checkbox"][formcontrolname="required"]');
    await requiredCheckbox.check();

    const registerButton = page.locator('#login');
    await registerButton.click();

    await expect(page.locator('.headcolor')).toContainText('Account Created Successfully');
    const loginButton = page.getByRole('button', { name: 'login' });
    await loginButton.click();

    const user_name = await page.locator('#userEmail');
    await user_name.fill(email);
    const user_password = await page.locator('#userPassword');
    await user_password.fill(password);

    const loginBtn = page.locator('#login');
    await expect(loginBtn).toBeVisible();
    await expect(loginBtn).toBeEnabled();
    await loginBtn.click();



    await page.pause();


});


