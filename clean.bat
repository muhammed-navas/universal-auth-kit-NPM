@echo off
echo Cleaning up temporary files...
del /f /q *.bundled_*.mjs 2>nul
if exist dist rmdir /s /q dist 2>nul
echo Cleanup completed!
