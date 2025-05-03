@echo off
echo Cleaning up before build...
call clean.bat

echo Building package...
npx tsup

if %ERRORLEVEL% NEQ 0 (
  echo Build failed with error code %ERRORLEVEL%
  exit /b %ERRORLEVEL%
)

echo Build completed successfully!
