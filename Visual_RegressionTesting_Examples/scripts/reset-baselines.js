const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const paths = [
  path.join(root, 'tests', 'visual-regression.spec.js-snapshots'),
  path.join(root, 'test-results'),
  path.join(root, 'playwright-report'),
];

for (const target of paths) {
  fs.rmSync(target, { recursive: true, force: true });
}

console.log('Baselines and previous reports removed. Run npm test to recreate them.');
