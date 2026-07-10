require('dotenv').config();

const authMode = (process.env.DB_AUTH || 'windows').toLowerCase();
const useWindowsAuth = authMode === 'windows';

const sql = useWindowsAuth
  ? require('mssql/msnodesqlv8')
  : require('mssql');

const commonConfig = {
  server: process.env.DB_SERVER || '.',
  database: process.env.DB_NAME || 'PlaywrightLearningDB',

  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30_000
  },

  requestTimeout: 30_000,
  connectionTimeout: 30_000
};

const dbConfig = useWindowsAuth
  ? {
      ...commonConfig,

      options: {
        trustedConnection: true,

        encrypt:
          String(process.env.DB_ENCRYPT).toLowerCase() === 'true',

        trustServerCertificate:
          String(
            process.env.DB_TRUST_SERVER_CERTIFICATE
          ).toLowerCase() !== 'false'
      }
    }
  : {
      ...commonConfig,

      port: Number(process.env.DB_PORT || 1433),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,

      options: {
        encrypt:
          String(process.env.DB_ENCRYPT).toLowerCase() === 'true',

        trustServerCertificate:
          String(
            process.env.DB_TRUST_SERVER_CERTIFICATE
          ).toLowerCase() !== 'false'
      }
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