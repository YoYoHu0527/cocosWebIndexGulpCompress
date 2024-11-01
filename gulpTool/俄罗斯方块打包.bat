@echo off
chcp 65001 > nul
@REM color 0A

echo 正确显示中文
echo.

@REM echo 1是正式版本 0是测试版本
@REM echo.

@REM set /p choice=Enter the number corresponding to your choice: 
@REM echo.

@REM if %choice%==1 (
@REM   set "buildParams=platform=web-mobile;debug=false;embedWebDebugger=false"
@REM ) else (
@REM   set "buildParams=platform=web-mobile;debug=false;embedWebDebugger=true"
@REM )

@REM "D:\ProgramData\cocos\editors\Creator\Creator\2.4.10\CocosCreator.exe" --path "E:\dev_Tetris_2x\clientGames\Tetris_2x" --build "platform=web-mobile"
call gulp build --"12"
@REM call gulp zip
pause

@REM 构建之后 文件会少4个 速度不是很明显，可先不用