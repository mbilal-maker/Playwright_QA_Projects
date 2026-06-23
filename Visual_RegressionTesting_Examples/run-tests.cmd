@echo off
setlocal
call npm test
if errorlevel 1 (
  echo.
  echo Visual differences or test failures were detected.
  echo Run: npm run report
  exit /b 1
)
echo.
echo All visual regression tests passed.
exit /b 0
