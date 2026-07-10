const express = require('express');
const path = require('path');
const { sql, getPool, closePool } = require('./db');
require('dotenv').config();

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/health', async (_req, res) => {
  try {
    const pool = await getPool();
    await pool.request().query('SELECT 1 AS ok');
    res.status(200).json({ status: 'UP', database: 'CONNECTED' });
  } catch (error) {
    res.status(503).json({
      status: 'DOWN',
      database: 'DISCONNECTED',
      error: error.message
    });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const { name, email, course, age } = req.body;

    if (!name || !email || !course || age === undefined) {
      return res.status(400).json({
        message: 'name, email, course and age are required'
      });
    }

    const numericAge = Number(age);
    if (!Number.isInteger(numericAge) || numericAge < 1 || numericAge > 120) {
      return res.status(400).json({ message: 'age must be between 1 and 120' });
    }

    const pool = await getPool();
    const result = await pool
      .request()
      .input('name', sql.NVarChar(100), name.trim())
      .input('email', sql.NVarChar(150), email.trim().toLowerCase())
      .input('course', sql.NVarChar(100), course.trim())
      .input('age', sql.Int, numericAge)
      .query(`
        INSERT INTO dbo.Students (Name, Email, Course, Age)
        OUTPUT
          INSERTED.Id,
          INSERTED.Name,
          INSERTED.Email,
          INSERTED.Course,
          INSERTED.Age,
          INSERTED.CreatedAt,
          INSERTED.UpdatedAt
        VALUES (@name, @email, @course, @age);
      `);

    return res.status(201).json(result.recordset[0]);
  } catch (error) {
    if (error.number === 2627 || error.number === 2601) {
      return res.status(409).json({ message: 'Email already exists' });
    }
    return res.status(500).json({ message: error.message });
  }
});

app.get('/api/students', async (_req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT Id, Name, Email, Course, Age, CreatedAt, UpdatedAt
      FROM dbo.Students
      ORDER BY Id DESC;
    `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/students/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const pool = await getPool();
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .query(`
        SELECT Id, Name, Email, Course, Age, CreatedAt, UpdatedAt
        FROM dbo.Students
        WHERE Id = @id;
      `);

    if (!result.recordset[0]) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/students/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, email, course, age } = req.body;

    if (!name || !email || !course || age === undefined) {
      return res.status(400).json({
        message: 'name, email, course and age are required'
      });
    }

    const pool = await getPool();
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .input('name', sql.NVarChar(100), name.trim())
      .input('email', sql.NVarChar(150), email.trim().toLowerCase())
      .input('course', sql.NVarChar(100), course.trim())
      .input('age', sql.Int, Number(age))
      .query(`
        UPDATE dbo.Students
        SET
          Name = @name,
          Email = @email,
          Course = @course,
          Age = @age,
          UpdatedAt = SYSUTCDATETIME()
        OUTPUT
          INSERTED.Id,
          INSERTED.Name,
          INSERTED.Email,
          INSERTED.Course,
          INSERTED.Age,
          INSERTED.CreatedAt,
          INSERTED.UpdatedAt
        WHERE Id = @id;
      `);

    if (!result.recordset[0]) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    if (error.number === 2627 || error.number === 2601) {
      return res.status(409).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const pool = await getPool();
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .query(`
        DELETE FROM dbo.Students
        OUTPUT DELETED.Id
        WHERE Id = @id;
      `);

    if (!result.recordset[0]) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: 'Unexpected server error' });
});

const server = app.listen(port, async () => {
  try {
    await getPool();
    console.log(`Application running at http://127.0.0.1:${port}`);
    console.log('SQL Server connection successful');
  } catch (error) {
    console.error('Application started, but SQL Server connection failed.');
    console.error(error.message);
  }
});

async function shutdown() {
  server.close(async () => {
    await closePool();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
