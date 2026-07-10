require('dotenv').config();

const sql = require('mssql');
const { dbConfig } = require('../src/db');

async function checkDatabase() {
  try {
    const pool = await sql.connect(dbConfig);

    const result = await pool.request().query(`
      SELECT
        DB_NAME() AS DatabaseName,
        @@SERVERNAME AS ServerName,
        (
          SELECT COUNT(*)
          FROM dbo.Students
        ) AS StudentCount;
    `);

    console.log('SQL Server connection successful:');
    console.table(result.recordset);
  } catch (error) {
    console.error('SQL Server connection failed:');
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    await sql.close();
  }
}

checkDatabase();