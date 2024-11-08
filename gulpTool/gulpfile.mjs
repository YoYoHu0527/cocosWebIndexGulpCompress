
/**
 * 压缩目录
 */
var path1 = 'E:/dev_EscapeMonkey/clientGames/EscapeMonkey/build/web-mobile/' //斗猿场
var path2 = 'E:/dev_BattleRoyale/clientGames/BattleRoyale/build/web-mobile/' //大逃杀
var path3 = 'E:/dev_Warcraft/clientGames/Warcraft/build/web-mobile/' //魔兽争霸
var path4 = 'E:/dev_FruitsSlot/clientGames/FruitsSlot/build/web-mobile/' //水果机
var path5 = 'E:/dev_HorseRacing/clientGames/horseRacing/build/web-mobile/' //赛马
var path6 = 'E:/dev_Roulette/clientGames/Roulette/build/web-mobile/' //轮盘
var path7 = 'E:/dev_Dice/clientGames/Dice/build/web-mobile/' //骰子
var path8 = 'E:/dev_Rocket/clientGames/Rocket/build/web-mobile/' //火箭
var path9 = 'E:/dev_Billiard/clientGames/Billiard/build/web-mobile/' //台球
var path10 = 'E:/dev_Plinko/clientGames/Plinko/build/web-mobile/' //弹珠
var path11 = 'E:/dev_Fishing/clientGames/Fishing/build/web-mobile/' //捕鱼
var path12 = 'E:/dev_Tetris_2x/clientGames/Tetris_2x/build/web-mobile/' //俄罗斯方块
var path13 = 'E:/dev_triColorLottery/clientGames/lottery/build/web-mobile/' //三色彩票游戏

//拷贝目录
var copyPath1 = "E:/GameIndex/EscapeMonkey/"
var copyPath2 = "E:/GameIndex/BattleRoyale/"
var copyPath3 = "E:/GameIndex/Warcraft/"
var copyPath4 = "E:/GameIndex/FruitsSlot/"
var copyPath5 = "E:/GameIndex/HorseRacing/"
var copyPath6 = "E:/GameIndex/Roulette/"
var copyPath7 = "E:/GameIndex/Dice/"
var copyPath8 = "E:/GameIndex/Rocket/"
var copyPath9 = "E:/GameIndex/Billiard/"
var copyPath10 = "E:/GameIndex/Plinko/"
var copyPath11 = "E:/GameIndex/Fishing/"
var copyPath12 = "E:/GameIndex/Tetris/"
var copyPath13 = "E:/GameIndex/triColorLottery/"

//执行时候的目录
var runMainPath = ""
var runCopyPath = ""

let assetsTime = Date.now().toString() //取一个时间戳

// var gulp = require('gulp');
// var htmlmin = require('gulp-htmlmin');
// var fileInline = require('gulp-file-inline');
// var uglify = require('gulp-uglify');
// var jsonmin = require('gulp-jsonmin');
// var replace = require('gulp-replace');
// var fs = require('fs');
// const plumber = require('gulp-plumber');


//使用es模块 gulp-zip好像只能用import导入
import fs from 'fs'
import gulp from 'gulp'
import fileInline from 'gulp-file-inline'
import htmlmin from 'gulp-htmlmin'
import jsonmin from 'gulp-jsonmin'
import replace from 'gulp-replace'
import uglify from 'gulp-uglify'
import zip from 'gulp-zip'
import path from 'path'

// 压缩html 内联css js
gulp.task('htmlmin', function (cb) {
	gulp.src(runMainPath + '*.html')
		.pipe(fileInline())
		.pipe(htmlmin({
			collapseWhitespace: true,//移出空格
			removeComments: true, //删除注释
			minifyJS: true,
			minifyCSS: true,
		}))
		.pipe(gulp.dest(runMainPath))
		.on('end', cb);
});

// 压缩js
gulp.task('script', function (cb) {
	gulp.src(runMainPath + '**/*.js')
		.pipe(uglify())
		.pipe(gulp.dest(runMainPath))
		.on('end', cb);
});

// 压缩json
gulp.task('minify-json', function (cb) {
	gulp.src(runMainPath + '**/*.json') // 匹配所有 JSON 文件
		.pipe(jsonmin())
		.pipe(gulp.dest(runMainPath))
		.on('end', cb);
});


// 匹配DR中的值并且替换为新的
gulp.task('replaceDR', function (cb) {
	// 读取源.html文件的内容
	const bHtmlContent = fs.readFileSync(runMainPath + 'index.html', 'utf8');

	// 从源.html中提取出Polyfills标签的src属性值
	const srcMatchPolyfills = bHtmlContent.match(/<script\s+src="(src\/polyfills\.bundle\.[a-zA-Z0-9]+\.js)"\s+charset="utf-8">\s*<\/script>/);
	const srcAttributeValuePolyfills = srcMatchPolyfills ? srcMatchPolyfills[1] : ''; // 提取到的src属性值

	// 从源.html中提取出SystemJS标签的src属性值
	const srcMatchSystemJS = bHtmlContent.match(/<script\s+src="(src\/system\.bundle\.[a-zA-Z0-9]+\.js)"\s+charset="utf-8">\s*<\/script>/);
	const srcAttributeValueSystemJS = srcMatchSystemJS ? srcMatchSystemJS[1] : ''; // 提取到的src属性值

	// 从源.html中提取出Import map标签的src属性值
	// const srcMatchImportMap = bHtmlContent.match(/<script\s+src="(src\/import-map\.[a-zA-Z0-9]+\.json)"\s+type="systemjs-importmap"\s+charset="utf-8">\s*<\/script>/);
	// const srcAttributeValueImportMap = srcMatchImportMap ? srcMatchImportMap[1] : ''; // 提取到的src属性值

	//读取cc.js文件
	let ccJsContent = function () {
		// 指定文件目录
		const directoryPath = runMainPath + 'cocos-js';
		let fileName = ''
		// 读取目录下的文件
		try {
			// 同步读取目录下的文件
			const files = fs.readdirSync(directoryPath);
			// 遍历文件
			for (const file of files) {
				// 提取文件名中的部分信息
				if (file.startsWith('cc.') && file.endsWith('.js')) {
					fileName = file; // 获取完整文件名，如 cc.0879.js
					break; // 跳出循环
				}
			}
		} catch (err) {
			console.error('Error reading directory:', err);
		}

		return fileName;
	}
	let ccName = ccJsContent()

	//读取settings.json文件
	let settingsJsonContent = function () {
		// 指定文件目录
		const directoryPath = runMainPath + 'src';
		let fileName = ''

		try {
			// 同步读取目录下的文件
			const files = fs.readdirSync(directoryPath);
			// 遍历文件
			for (const file of files) {
				// 提取文件名中的部分信息
				if (file.startsWith('settings.') && file.endsWith('.json')) {
					fileName = file; // 获取完整文件名，如 cc.0879.js
					break; // 跳出循环
				}
			}
		} catch (err) {
			console.error('Error reading directory:', err);
		}

		return fileName;
	}
	let settingsJsonName = settingsJsonContent()

	//处理入口index文件
	// const srcMatchIndex = bHtmlContent.match(/System\.import\('.\/index\.[a-zA-Z0-9]+\.js'\)/);
	// const srcAttributeValuesrcIndex = srcMatchIndex ? srcMatchIndex[0] : ''; // 提取到的src属性值

	//处理在indexD中的vsconsole
	const srcMatchVsconsole = bHtmlContent.match(/<script\s+src="\.\/vconsole\.min\.[a-zA-Z0-9]+\.js"><\/script>/);
	const srcAttributeValuesrcVsconsole = srcMatchVsconsole ? srcMatchVsconsole[0] : ''; // 提取到的src属性值


	gulp.src([runMainPath + 'indexD.html', runMainPath + 'indexR.html']) // 选择 index.html 文件作为源文件

		.pipe(replace(/src\/polyfills\.bundle\.[a-zA-Z0-9]+\.js/g, srcAttributeValuePolyfills))

		.pipe(replace(/src\/system\.bundle\.[a-zA-Z0-9]+\.js/g, srcAttributeValueSystemJS))

		.pipe(replace(/cc\.[a-zA-Z0-9]+\.js/g, ccName))

		.pipe(replace(/settings\.[a-zA-Z0-9]+\.json/g, settingsJsonName))

		.pipe(replace(/<script\s+src="\.\/vconsole\.min\.[a-zA-Z0-9]+\.js"><\/script>/g, srcAttributeValuesrcVsconsole))

		.pipe(gulp.dest(runMainPath)) // 将处理后的 HTML 文件保存到目标目录
		.on('end', cb);
});


//将闪屏 css indexDR 加载gif 拷回去
gulp.task('copy', function (cb) {
	gulp.src([runCopyPath + '*.jpg', runCopyPath + '*.gif', runCopyPath + '*.png', runCopyPath + '*.css', runCopyPath + '*.html']) // 选择要拷贝文件
		.pipe(gulp.dest(runMainPath)) // 将图片文件拷贝到目标目录，覆盖同名文件
		.on('end', cb);
});

//版本号加1
gulp.task("addVersion", function (cb) {
	gulp.src([runCopyPath + 'indexD.html', runCopyPath + 'indexR.html'])
		.pipe(replace(/let\s+version\s*=\s*"v(\d+)\.(\d+)\.(\d+)"/, function (match, major, minor, patch) {
			// 将版本号的 patch 部分加1
			patch = parseInt(patch) + 1;
			if (patch >= 100) {
				patch = 0
				minor = parseInt(minor) + 1;
				if (minor >= 100) {
					minor = 0
					major = parseInt(major) + 1;
					if (major >= 100) {
						major = 1
					}
				}
			}
			return `let version = "v${major}.${minor}.${patch}"`;
		}))
		.pipe(gulp.dest(runCopyPath)) // 将替换后的文件输出到 dist 目录
		.on('end', cb);
})


//创建任务组合任务
/**
 * 1.版本号先加加
 * 2.拷贝回去
 * 3.替换为新值
 * 4.压缩json
 * 5.内联html
 * 6.压缩js
 */
gulp.task('build', function (done) {
	//在这个任务里面去设置路径
	const args = process.argv[3].substring(2)
	switch (Number(args)) {
		case 1: //斗猿场
			runMainPath = path1
			runCopyPath = copyPath1
			break;
		case 2: //大逃杀
			runMainPath = path2
			runCopyPath = copyPath2
			break;
		case 3: //魔兽争霸
			runMainPath = path3
			runCopyPath = copyPath3
			break;
		case 4: //水果机
			runMainPath = path4
			runCopyPath = copyPath4
			break;
		case 5: //赛马
			runMainPath = path5
			runCopyPath = copyPath5
			break;
		case 6: //轮盘赌
			runMainPath = path6
			runCopyPath = copyPath6
			break;
		case 7: //摇骰子
			runMainPath = path7
			runCopyPath = copyPath7
			break;
		case 8: //火箭游戏
			runMainPath = path8
			runCopyPath = copyPath8
			break;
		case 9: //台球游戏
			runMainPath = path9
			runCopyPath = copyPath9
			break;
		case 10: //台球游戏
			runMainPath = path10
			runCopyPath = copyPath10
			break;
		case 11: //捕鱼游戏
			runMainPath = path11
			runCopyPath = copyPath11
			break;
		case 12: //俄罗斯方块
			runMainPath = path12
			runCopyPath = copyPath12

			//1.先替换入口目录index*.html里面引入文件的MD5值,2.再把入口文件里面的所有值拷贝回去,3.内联css、js,4.压缩所有js,压缩所有json
			// const buildTasks__tetris = gulp.series("copy_cocos2dJs", "replaceDR_tetris", "copy_tetris", "replaceMD5_tetris", "htmlmin", "script_tetris", "minify-json", "tetris_zip", 'clean');
			const buildTasks__tetris = gulp.series("copy_cocos2dJs", "replaceDR_tetris", "copy_tetris", "replaceMD5_tetris", "htmlmin", "script_tetris", "minify-json", "tetris_zip");
			//执行tetris_zip任务
			buildTasks__tetris()
			done(); // 调用回调函数，通知 Gulp 任务完成
			return;
		case 13: //三色彩票游戏
			runMainPath = path13
			runCopyPath = copyPath13
			break;
		default:
			break;
	}
	//版本号加1、将入口文件拷贝到构建后的目录、替换为新值、压缩json、内联html、压缩js
	const buildTasks = gulp.series('addVersion', 'copy', 'replaceDR', 'minify-json', 'htmlmin', 'script');
	buildTasks()
	done(); // 调用回调函数，通知 Gulp 任务完成
})

// gulp.series('addVersion', 'copy', 'replaceDR', 'minify-json', 'htmlmin', 'script'));


/**
 * 单独为俄罗斯方块写一个
 */
//===========================================================>>开始

//将css indexDR拷回去
gulp.task('copy_tetris', function (cb) {
	gulp.src([runCopyPath + '*.css', runCopyPath + '*.html', runCopyPath + '*.js',]) // 选择要拷贝文件
		.pipe(gulp.dest(runMainPath)) // 将图片文件拷贝到目标目录，覆盖同名文件
		.on('end', cb);
});

//修改uncompress里面的MD5值
gulp.task('replaceMD5_tetris', function (cb) {
	// 读取源.html文件的内容
	gulp.src(runMainPath + 'uncompress.js')
		// 使用正则表达式替换 assetsMd5 的值
		.pipe(replace(/let assetsMd5 = ".*?";/, `let assetsMd5 = "${assetsTime}";`))
		.pipe(gulp.dest(runMainPath)) // 将处理后的 HTML 文件保存到目标目录
		.on('end', cb);
});

// 匹配DR中的值并且替换为新的
gulp.task('replaceDR_tetris', function (cb) {
	// 读取源.html文件的内容
	const bHtmlContent = fs.readFileSync(runMainPath + 'index.html', 'utf8');

	// 从源.html中提取出settings标签的src属性值
	const srcMatchSetting = bHtmlContent.match(/<script\s+src="src\/settings\.[a-zA-Z0-9]+\.js"\s+charset="utf-8"><\/script>/)
	const srcAttributeValueSetting = srcMatchSetting[0].match(/<script\s+src="([^"]+)"\s+charset="utf-8"><\/script>/)[1];; // 提取到的src属性值

	// 从源.html中提取出main标签的src属性值
	const srcMatchMain = bHtmlContent.match(/<script\s+src="(main\.[a-zA-Z0-9]+\.js)"\s+charset="utf-8">\s*<\/script>/);
	const srcAttributeValueMain = srcMatchMain ? srcMatchMain[1] : ''; // 提取到的src属性值


	//处理在indexD中的vsconsole 下面替换的时候 空就不替换
	const srcMatchVsconsole = bHtmlContent.match(/<script\s+src="(vconsole\.min\.[a-zA-Z0-9]+\.js)"><\/script>/);
	const srcAttributeValuesrcVsconsole = srcMatchVsconsole ? srcMatchVsconsole[0] : ''; // 提取到的src属性值


	gulp.src(runCopyPath + '*.html') // 选择 index.html 文件作为源文件

		.pipe(replace(/src\/settings\.[a-zA-Z0-9]+\.js/g, srcAttributeValueSetting))

		.pipe(replace(/main\.[a-zA-Z0-9]+\.js/g, srcAttributeValueMain))


		.pipe(replace(/<script\s+src="vconsole\.min\.[a-zA-Z0-9]+\.js"><\/script>/g, srcAttributeValuesrcVsconsole))

		.pipe(gulp.dest(runCopyPath)) // 将处理后的 HTML 文件保存到目标目录
		.on('end', cb);
});


// 压缩js 这个js不知道为什么一直失败
gulp.task('script_tetris', function (cb) {
	gulp.src(["E:/dev_Tetris_2x/clientGames/Tetris_2x/build/web-mobile/" + '**/*.js', '!E:/dev_Tetris_2x/clientGames/Tetris_2x/build/web-mobile/vconsole.min*.js'])
		.pipe(uglify())
		.pipe(gulp.dest("E:/dev_Tetris_2x/clientGames/Tetris_2x/build/web-mobile/"))
		.on('end', cb);
});

//拷贝cocos2d-js.js 到assets目录
gulp.task('copy_cocos2dJs', function (cb) {
	gulp.src(runMainPath + '/cocos2d-js*.js')
		.pipe(gulp.dest(runMainPath + 'assets/'))
		.on('end', cb);
});


//生成压缩包 我需要将assets目录压缩
gulp.task('tetris_zip', function (cb) {
	const zipFileName = `assets_${assetsTime}.zip`;
	gulp.src(runMainPath + 'assets/**/*') // 指定要压缩的目录
		.pipe(zip(zipFileName)) // 压缩成 compressed.zip 文件
		.pipe(gulp.dest(runMainPath)) // 输出压缩文件到指定目录
		.on('end', cb);

});

// 定义一个任务来删除其他内容
gulp.task('clean', function (cb) {
	function deleteFiles(dir) {
		fs.readdirSync(dir).forEach(file => {
			const filePath = path.join(dir, file);
			if (fs.statSync(filePath).isDirectory()) {
				deleteFiles(filePath); // 递归删除子目录中的文件
			} else {
				const ext = path.extname(filePath).toLowerCase();
				if (ext !== '.html' && ext !== '.zip') {
					fs.unlinkSync(filePath); // 删除除了 .html 和 .zip 文件之外的所有文件
				}
			}
		});
	}
	function deleteEmptyDirectories(dir) {
		fs.readdirSync(dir).forEach(file => {
			const filePath = path.join(dir, file);
			if (fs.statSync(filePath).isDirectory()) {
				deleteEmptyDirectories(filePath); // 递归删除子目录中的空目录
				if (fs.readdirSync(filePath).length === 0) {
					fs.rmdirSync(filePath); // 删除空目录
				}
			}
		});
	}

	deleteFiles(runMainPath);
	deleteEmptyDirectories(runMainPath);
	cb(); // 标记任务完成

});

//<<===========================================================结束

