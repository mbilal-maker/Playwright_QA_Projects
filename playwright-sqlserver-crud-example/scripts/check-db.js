const { getPool, closePool } = require('../src/db');

(async () => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT
        DB_NAME() AS DatabaseName,
        @@SERVERNAME AS ServerName,
        COUNT(*) AS StudentCount
      FROM dbo.Students;
    `);

    console.log('SQL Server connection successful:');
    console.table(result.recordset);
    process.exitCode = 0;
  } catch (error) {
    console.error('SQL Server connection failed:');
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    await closePool();
  }
})();
