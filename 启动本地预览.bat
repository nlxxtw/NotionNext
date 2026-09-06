@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo  ================================
echo   NotionNext 本地预览 - 启动
echo  ================================
echo.

if not exist ".env.local" (
  echo [提示] 未找到 .env.local，正在创建默认配置...
  (
    echo NEXT_PUBLIC_THEME=heo
    echo NOTION_PAGE_ID=2c8d388c3b588275bfbc01abb04c8781
    echo NEXT_PUBLIC_LANG=zh-CN
    echo NEXT_PUBLIC_APPEARANCE=light
  ) > .env.local
)

echo 正在检查 3000 端口...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
  echo 发现已有进程占用 3000，先结束 PID %%a
  taskkill /PID %%a /F >nul 2>&1
)

echo.
echo 启动中，请稍候...
echo 浏览器打开: http://localhost:3000
echo 关闭请运行「关闭本地预览.bat」，或在本窗口按 Ctrl+C
echo.

where npm >nul 2>&1
if errorlevel 1 (
  echo [错误] 未找到 npm / Node.js，请先安装 Node.js 22+
  pause
  exit /b 1
)

npx --yes next dev -p 3000
pause
