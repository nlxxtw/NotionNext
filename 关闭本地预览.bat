@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo  ================================
echo   NotionNext 本地预览 - 关闭
echo  ================================
echo.

set FOUND=0
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
  set FOUND=1
  echo 正在结束占用 3000 端口的进程 PID %%a ...
  taskkill /PID %%a /F >nul 2>&1
)

if "%FOUND%"=="0" (
  echo 当前没有检测到本地预览（3000 端口空闲）
) else (
  echo 已关闭本地预览
)

echo.
pause
