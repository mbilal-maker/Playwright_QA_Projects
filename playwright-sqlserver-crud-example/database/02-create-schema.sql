USE PlaywrightLearningDB;
GO

IF OBJECT_ID('dbo.Students', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Students
    (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(100) NOT NULL,
        Email NVARCHAR(150) NOT NULL,
        Course NVARCHAR(100) NOT NULL,
        Age INT NOT NULL,
        CreatedAt DATETIME2 NOT NULL
            CONSTRAINT DF_Students_CreatedAt DEFAULT SYSUTCDATETIME(),
        UpdatedAt DATETIME2 NOT NULL
            CONSTRAINT DF_Students_UpdatedAt DEFAULT SYSUTCDATETIME(),
        CONSTRAINT UQ_Students_Email UNIQUE (Email),
        CONSTRAINT CK_Students_Age CHECK (Age BETWEEN 1 AND 120)
    );
END
GO
