@echo off
chcp 65001 > nul
color 0A

echo 正确显示中文
echo.

echo 当在cocos creator中构建项目后 只需要执行一下这个批处理就行 会自动生级版本 同步index修改
echo 当没有需要的游戏时 需要1.修改bat 2.新建启动index 3.修改gulpJS
echo.

echo select A path
echo     1. EscapeMonkey (斗猿场)
echo     2. BattleRoyale (大逃杀)
echo     3. Warcraft (魔兽争霸)
echo.

set /p choice=Enter the number corresponding to your choice: 
echo.

call gulp build --"%choice%"
pause
