@echo off
setlocal

echo Installing Node dependencies...
call npm install
if errorlevel 1 goto :error

echo.
echo Running visual tests in installed Google Chrome...
echo Missing baselines will be created automatically on the first run.
call npm test
if errorlevel 1 goto :error

echo.
echo SUCCESS: Visual regression setup and comparison completed.
exit /b 0

:error
echo.
echo FAILED: Review the error shown above.
exit /b 1
