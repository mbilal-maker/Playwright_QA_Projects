# Playwright + REST API + SQL Server CRUD Learning Project

This project demonstrates the complete validation flow:

1. Create, read, update and delete a student through REST APIs.
2. Query SQL Server directly from Playwright tests.
3. Compare API response data with database data.
4. Create a student from a browser frontend.
5. Verify that the frontend request created the expected SQL Server row.

## Technology

- Node.js
- Express REST API
- Microsoft SQL Server
- `mssql` Node.js driver
- Playwright Test
- Google Chrome using `channel: "chrome"`
- HTML, CSS and JavaScript frontend

## Project structure

```text
playwright-sqlserver-crud-example/
├── database/
│   ├── 01-create-login-and-database.sql
│   ├── 02-create-schema.sql
│   └── 03-useful-queries.sql
├── public/
│   ├── index.html
│   ├── app.js
│   └── styles.css
├── scripts/
│   └── check-db.js
├── src/
│   ├── db.js
│   └── server.js
├── tests/
│   ├── api/
│   │   └── student-crud-api-db.spec.js
│   ├── helpers/
│   │   └── db.helper.js
│   └── ui/
│       └── student-ui-db.spec.js
├── .env.example
├── package.json
└── playwright.config.js
```

# Before running the project

## 1. Confirm required software

Install or confirm:

- Node.js 20 LTS
- Google Chrome
- SQL Server
- SQL Server Management Studio
- Git is optional

Check Node:

```powershell
node -v
npm -v
```

## 2. Make sure SQL Server accepts TCP/IP connections

Open **SQL Server Configuration Manager**.

Go to:

```text
SQL Server Network Configuration
  > Protocols for your SQL Server instance
```

Enable:

```text
TCP/IP
```

Open TCP/IP properties, select **IP Addresses**, then under `IPAll`:

```text
TCP Dynamic Ports: leave empty
TCP Port: 1433
```

Restart the SQL Server service afterward.

For a named instance such as `SQLEXPRESS`, you may also need to start **SQL Server Browser**. The easiest learning setup is to use TCP port `1433`.

## 3. Enable SQL Server authentication

In SQL Server Management Studio:

1. Right-click the SQL Server instance.
2. Select **Properties**.
3. Open **Security**.
4. Select **SQL Server and Windows Authentication mode**.
5. Restart the SQL Server service.

This project uses SQL authentication because it is simpler and more portable for Node.js learning projects.

## 4. Create database, login and table

Open SQL Server Management Studio as an administrator.

Run these scripts in order:

```text
database/01-create-login-and-database.sql
database/02-create-schema.sql
```

The default local learning credentials are:

```text
Database: PlaywrightLearningDB
Username: playwright_user
Password: Playwright@12345
Port: 1433
```

Do not use this example password in a real project.

## 5. Configure environment variables

Copy:

```text
.env.example
```

and rename the copied file to:

```text
.env
```

Default values:

```env
PORT=3000
BASE_URL=http://127.0.0.1:3000

DB_SERVER=localhost
DB_PORT=1433
DB_NAME=PlaywrightLearningDB
DB_USER=playwright_user
DB_PASSWORD=Playwright@12345
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true
```

### Common DB_SERVER values

Default local instance:

```env
DB_SERVER=localhost
```

SQL Express named instance can sometimes use:

```env
DB_SERVER=localhost
```

with port 1433 after TCP/IP configuration.

A machine name can also be used:

```env
DB_SERVER=YOUR-PC-NAME
```

## 6. Install dependencies

Open PowerShell in the project folder:

```powershell
npm install
```

The Playwright configuration uses your installed Google Chrome, so a bundled Chromium download is not required for test execution.

## 7. Test the database connection

```powershell
npm run check:db
```

Expected result:

```text
SQL Server connection successful
```

If it fails, check:

- SQL Server service is running.
- TCP/IP is enabled.
- Port 1433 is listening.
- SQL authentication is enabled.
- `.env` credentials are correct.
- Windows Firewall is not blocking local SQL Server TCP access.

## 8. Run the application manually

```powershell
npm start
```

Open:

```text
http://127.0.0.1:3000
```

You can create, edit and delete students from the frontend.

The application flow is:

```text
Browser UI
   -> Express REST API
      -> SQL Server Students table
```

## 9. Run Playwright tests

Run all API and UI tests:

```powershell
npm test
```

Run only API CRUD and database validation:

```powershell
npm run test:api
```

Run only frontend and database validation:

```powershell
npm run test:ui
```

Run with Chrome visible:

```powershell
npm run test:headed
```

Debug:

```powershell
npm run test:debug
```

Open HTML report:

```powershell
npm run report
```

The Playwright `webServer` configuration automatically starts the Node.js application before tests.

# What the API test validates

The file:

```text
tests/api/student-crud-api-db.spec.js
```

performs the following sequence:

## CREATE

```text
POST /api/students
```

Then it queries:

```sql
SELECT * FROM dbo.Students WHERE Id = @id;
```

and compares the SQL row with the request and response.

## READ

```text
GET /api/students/{id}
```

Then it compares the API response with the database row.

## UPDATE

```text
PUT /api/students/{id}
```

Then it verifies that SQL Server contains the changed name, course and age.

## DELETE

```text
DELETE /api/students/{id}
```

Then it confirms the SQL query returns no row.

# What the UI test validates

The file:

```text
tests/ui/student-ui-db.spec.js
```

does the following:

1. Opens the frontend in Google Chrome.
2. Enters student data.
3. Clicks **Create Student**.
4. Waits for the POST API response.
5. Validates the student appears in the HTML table.
6. Queries SQL Server directly.
7. Validates the exact database row.

This is an end-to-end validation:

```text
UI -> API -> Database
```

# Important testing design points

## Use parameterized SQL queries

The helper uses:

```javascript
.input('email', sql.NVarChar(150), email)
```

instead of building raw SQL strings. This helps prevent SQL injection and quotation errors.

## Use unique test data

Emails include `Date.now()`:

```javascript
const email = `api.student.${Date.now()}@example.com`;
```

This prevents duplicate-email failures when tests run repeatedly.

## Clean up test data

Each test suite deletes its generated email in `afterAll`, even when a test fails before normal deletion.

## Keep database validation separate

Database query functions are placed in:

```text
tests/helpers/db.helper.js
```

Tests remain readable and do not duplicate SQL connection code.

## Run CRUD tests serially

The CREATE, READ, UPDATE and DELETE tests share one student ID. The configuration uses one worker and the test file follows a controlled sequence.

For production frameworks, an even stronger design is to make each test independent by creating its own data in `beforeEach`.

# Troubleshooting

## Error: Login failed for user

Check:

- SQL authentication is enabled.
- Login exists.
- Password matches `.env`.
- User is mapped to `PlaywrightLearningDB`.

## Error: Failed to connect to localhost:1433

Check:

- TCP/IP is enabled.
- SQL Server service restarted after enabling TCP/IP.
- Port 1433 is configured.
- Correct SQL Server instance is running.

Use PowerShell:

```powershell
Test-NetConnection localhost -Port 1433
```

## Error: Cannot find module dotenv or mssql

Run:

```powershell
npm install
```

## Chrome cannot launch

Confirm Chrome is installed. The project deliberately uses:

```javascript
channel: 'chrome'
```

## Port 3000 already in use

Change `.env`:

```env
PORT=3001
BASE_URL=http://127.0.0.1:3001
```

# Manual API examples

Create:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri http://127.0.0.1:3000/api/students `
  -ContentType "application/json" `
  -Body '{
    "name": "Bilal",
    "email": "bilal.learning@example.com",
    "course": "Playwright",
    "age": 28
  }'
```

Read all:

```powershell
Invoke-RestMethod http://127.0.0.1:3000/api/students
```

Update student 1:

```powershell
Invoke-RestMethod `
  -Method Put `
  -Uri http://127.0.0.1:3000/api/students/1 `
  -ContentType "application/json" `
  -Body '{
    "name": "Bilal Updated",
    "email": "bilal.learning@example.com",
    "course": "Playwright DB Testing",
    "age": 29
  }'
```

Delete student 1:

```powershell
Invoke-RestMethod `
  -Method Delete `
  -Uri http://127.0.0.1:3000/api/students/1
```
