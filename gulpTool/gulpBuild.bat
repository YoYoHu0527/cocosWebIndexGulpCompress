@echo off
chcp 65001 > nul
color 0A

echo 正确显示中文
echo.

echo 当在cocos creator中构建项目后 只需要执行一下这个批处理就行 会自动生级版本 同步index修改
echo 当没有需要的游戏时 需要1.修改bat 2.新建启动index 3.修改gulpJS
echo.

echo select A path
echo     1. EscapeMonkey (斗猿场-全屏)
echo     2. BattleRoyale (大逃杀-全屏)
echo     3. Warcraft (魔兽争霸-全屏)
echo     4. FruitsSlot (水果机-半屏)
echo     5. HorseRacing (赛马-半屏)
echo     6. Roulette (轮盘赌-半屏)
echo     7. Dice (摇骰子-半屏)
echo     8. Rocket (火箭游戏-半屏)
echo     9. Billiard (台球游戏-半屏)
echo     10. Plinko (弹珠游戏-半屏)
echo     11. Fishing (捕鱼游戏-半屏)
echo     12. Tetris (俄罗斯方块-房间内游戏)
echo     13. triColorLottery (三色彩票-半屏)
echo.

set /p choice=Enter the number corresponding to your choice: 
echo.

call gulp build --"%choice%"
pause
