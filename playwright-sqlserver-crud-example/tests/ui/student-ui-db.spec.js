const { test, expect } = require('@playwright/test');
const {
  getStudentByEmail,
  deleteStudentByEmail
} = require('../helpers/db.helper');

test.describe('Frontend to API to SQL Server validation', () => {
  const email = `ui.student.${Date.now()}@example.com`;

  test.afterAll(async () => {
    await deleteStudentByEmail(email);
  });

  test('create a student from UI and validate it directly in SQL Server', async ({ page }) => {
    await page.goto('/');

    await page.getByLabel('Name').fill('UI Test Student');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Course').fill('Playwright UI Testing');
    await page.getByLabel('Age').fill('26');

    const createResponsePromise = page.waitForResponse(
      response =>
        response.url().endsWith('/api/students') &&
        response.request().method() === 'POST'
    );

    await page.getByRole('button', { name: 'Create Student' }).click();

    const createResponse = await createResponsePromise;
    expect(createResponse.status()).toBe(201);

    await expect(page.getByRole('status')).toHaveText(
      'Student created successfully'
    );

    const row = page.locator('tr', { hasText: email });
    await expect(row).toContainText('UI Test Student');
    await expect(row).toContainText('Playwright UI Testing');

    const dbStudent = await getStudentByEmail(email);
    expect(dbStudent).not.toBeNull();
    expect(dbStudent.Name).toBe('UI Test Student');
    expect(dbStudent.Course).toBe('Playwright UI Testing');
    expect(dbStudent.Age).toBe(26);
  });
});
