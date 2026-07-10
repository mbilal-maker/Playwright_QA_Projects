const { sql, getPool } = require('../../src/db');

async function getStudentById(id) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('id', sql.Int, id)
    .query(`
      SELECT Id, Name, Email, Course, Age, CreatedAt, UpdatedAt
      FROM dbo.Students
      WHERE Id = @id;
    `);

  return result.recordset[0] || null;
}

async function getStudentByEmail(email) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('email', sql.NVarChar(150), email)
    .query(`
      SELECT Id, Name, Email, Course, Age, CreatedAt, UpdatedAt
      FROM dbo.Students
      WHERE Email = @email;
    `);

  return result.recordset[0] || null;
}

async function deleteStudentByEmail(email) {
  const pool = await getPool();
  await pool
    .request()
    .input('email', sql.NVarChar(150), email)
    .query('DELETE FROM dbo.Students WHERE Email = @email;');
}

module.exports = {
  getStudentById,
  getStudentByEmail,
  deleteStudentByEmail
};
