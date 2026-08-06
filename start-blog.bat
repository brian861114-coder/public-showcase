@echo off
setlocal
cd /d "%~dp0"
title NOTES Blog
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-blog.ps1"
if errorlevel 1 pause
endlocal
