const { test, expect } = require('@playwright/test');

test.describe('Network, route, request, reload, and wait actions', () => {
  test('uses waitForResponse while opening a public API URL', async ({ page }) => {
    const responsePromise = page.waitForResponse(response =>
      response.url().includes('/todos/1') && response.status() === 200
    );

    await page.goto('https://jsonplaceholder.typicode.com/todos/1');
    const response = await responsePromise;
    const body = await response.json();

    expect(body.id).toBe(1);
    expect(body).toHaveProperty('title');
  });

  test('uses request.get for direct API testing', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body.id).toBe(1);
  });

  test('uses route, fulfill, continue-style interception, and waitForLoadState', async ({ page }) => {
    await page.route('**/todos/1', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          userId: 1,
          id: 1,
          title: 'mocked todo from Playwright route',
          completed: true
        })
      });
    });

    await page.setContent(`
      <html>
        <body>
          <h1>Network Mock Demo</h1>
          <button id="load">Load Todo</button>
          <pre id="output"></pre>
          <script>
            document.getElementById('load').addEventListener('click', async () => {
              const res = await fetch('https://jsonplaceholder.typicode.com/todos/1');
              const data = await res.json();
              document.getElementById('output').textContent = JSON.stringify(data, null, 2);
            });
          </script>
        </body>
      </html>
    `);

    await page.waitForLoadState('domcontentloaded');
    const responsePromise = page.waitForResponse('**/todos/1');
    await page.locator('#load').click();
    await responsePromise;

    await expect(page.locator('#output')).toContainText('mocked todo from Playwright route');
  });
});
