/*
Run this file in SQL Server Management Studio as a SQL Server administrator.

For local learning only, this script creates:
- Database: PlaywrightLearningDB
- Login: playwright_user
- Password: Playwright@12345

Change the password before using this approach outside your laptop.
*/

USE master;
GO

IF DB_ID('PlaywrightLearningDB') IS NULL
BEGIN
    CREATE DATABASE PlaywrightLearningDB;
END
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.sql_logins
    WHERE name = 'playwright_user'
)
BEGIN
    CREATE LOGIN playwright_user
    WITH PASSWORD = 'Playwright@12345',
         CHECK_POLICY = ON;
END
GO

USE PlaywrightLearningDB;
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.database_principals
    WHERE name = 'playwright_user'
)
BEGIN
    CREATE USER playwright_user FOR LOGIN playwright_user;
END
GO

ALTER ROLE db_datareader ADD MEMBER playwright_user;
ALTER ROLE db_datawriter ADD MEMBER playwright_user;
GO
