USE PlaywrightLearningDB;
GO

SELECT * FROM dbo.Students ORDER BY Id DESC;

-- Find one student by email:
-- SELECT * FROM dbo.Students WHERE Email = 'example@test.com';

-- Delete all learning data:
-- DELETE FROM dbo.Students;

-- Reset identity after deleting all data:
-- DBCC CHECKIDENT ('dbo.Students', RESEED, 0);
