const playwrightPackage = require('@playwright/test/package.json');

const expectedPlaywrightVersion = '1.60.0';
const actualPlaywrightVersion = playwrightPackage.version;

console.log(`Node.js: ${process.version}`);
console.log(`Playwright: ${actualPlaywrightVersion}`);

if (actualPlaywrightVersion !== expectedPlaywrightVersion) {
  throw new Error(
    `This project requires @playwright/test ${expectedPlaywrightVersion}. ` +
      `Installed version: ${actualPlaywrightVersion}. Run npm ci.`
  );
}

if (!process.version.startsWith('v22.15.')) {
  console.warn(
    'Note: this package was specifically validated with Node.js v22.15.0.'
  );
}
