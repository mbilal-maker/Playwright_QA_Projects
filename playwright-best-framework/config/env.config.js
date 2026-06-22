require('dotenv').config();
const qa = require('../data/env/qa.json');
const staging = require('../data/env/staging.json');

function getEnvConfig() {
  const envName = process.env.ENV || 'qa';
  const configs = { qa, staging };
  const selectedConfig = configs[envName];

  if (!selectedConfig) {
    throw new Error(`Invalid ENV value: ${envName}. Supported values: ${Object.keys(configs).join(', ')}`);
  }

  return {
    ...selectedConfig,
    envName,
    headless: process.env.HEADLESS === 'true'
  };
}

module.exports = { getEnvConfig };
