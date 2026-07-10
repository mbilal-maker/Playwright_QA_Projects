const sql = require('mssql');
require('dotenv').config();

const dbConfig = {
  server: process.env.DB_SERVER || 'localhost',
  port: Number(process.env.DB_PORT || 1433),
  database: process.env.DB_NAME || 'PlaywrightLearningDB',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,

  options: {
    encrypt:
      String(process.env.DB_ENCRYPT).toLowerCase() === 'true',

    trustServerCertificate:
      String(
        process.env.DB_TRUST_SERVER_CERTIFICATE
      ).toLowerCase() !== 'false'
  },

  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30_000
  },

  requestTimeout: 30_000,
  connectionTimeout: 30_000
};

let pool;

async function getPool() {
  if (!pool) {
    pool = await sql.connect(dbConfig);
  }

  return pool;
}

async function closePool() {
  if (pool) {
    await pool.close();
    pool = undefined;
  }
}

module.exports = {
  sql,
  dbConfig,
  getPool,
  closePool
};