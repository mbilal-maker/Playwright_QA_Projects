const path = require('path');

function getEnvConfig() {
  const env = process.env.TEST_ENV || 'qa';
  const configPath = path.resolve(__dirname, `../data/env/${env}.json`);
  const config = require(configPath);
  config.baseURL = config.baseURL.replace('__PROJECT_ROOT__', path.resolve(__dirname, '..').replace(/\\/g, '/'));
  return config;
}

module.exports = { getEnvConfig };
