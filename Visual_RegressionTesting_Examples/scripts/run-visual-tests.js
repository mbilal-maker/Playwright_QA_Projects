const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const snapshotDir = path.join(
  root,
  'tests',
  'visual-regression.spec.js-snapshots'
);

const snapshotNames = [
  'login-page',
  'inventory-dashboard',
  'empty-cart-state',
  'invalid-login-error',
  'responsive-inventory',
  'masked-timestamp',
  'masked-username',
  'inventory-product-card',
  'side-menu-animation-disabled',
  'locked-user-error',
];

const projects = ['desktop-chrome', 'mobile-chrome'];
const platform = process.platform;

function expectedSnapshotPaths() {
  return projects.flatMap((project) =>
    snapshotNames.map((name) =>
      path.join(snapshotDir, `${name}-${project}-${platform}.png`)
    )
  );
}

function runPlaywright(args) {
  const cliPath = path.join(root, 'node_modules', 'playwright', 'cli.js');

  if (!fs.existsSync(cliPath)) {
    console.error('\nDependencies are missing. Run: npm install\n');
    return 1;
  }

  const result = spawnSync(process.execPath, [cliPath, 'test', ...args], {
    cwd: root,
    env: process.env,
    stdio: 'inherit',
  });

  return typeof result.status === 'number' ? result.status : 1;
}

const missingSnapshots = expectedSnapshotPaths().filter(
  (snapshotPath) => !fs.existsSync(snapshotPath)
);

if (missingSnapshots.length > 0) {
  console.log('\n============================================================');
  console.log('First run detected: visual baselines are missing.');
  console.log('Creating Windows/Google Chrome baselines now...');
  console.log('============================================================\n');

  const updateExitCode = runPlaywright(['--update-snapshots']);
  if (updateExitCode !== 0) process.exit(updateExitCode);

  console.log('\n============================================================');
  console.log('Baselines created. Running the real comparison now...');
  console.log('============================================================\n');
}

const userArguments = process.argv.slice(2);
process.exit(runPlaywright(userArguments));
