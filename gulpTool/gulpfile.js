
/**
 * 压缩目录
 */
var path1 = 'E:/dev_EscapeMonkey/clientGames/EscapeMonkey/build/web-mobile/' //斗猿场
var path2 = 'E:/dev_BattleRoyale/clientGames/BattleRoyale/build/web-mobile/' //大逃杀
var path3 = 'E:/dev_Warcraft/clientGames/Warcraft/build/web-mobile/' //魔兽争霸

//拷贝目录
var copyPath1 = "E:/GameIndex/EscapeMonkey/"
var copyPath2 = "E:/GameIndex/BattleRoyale/"
var copyPath3 = "E:/GameIndex/Warcraft/"

//执行时候的目录
var runMainPath = ""
var runCopyPath = ""



var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var fileInline = require('gulp-file-inline');
var uglify = require('gulp-uglify');
var jsonmin = require('gulp-jsonmin');
var replace = require('gulp-replace');
var fs = require('fs');

// 压缩html 内联css js
gulp.task('htmlmin', function (cb) {
	gulp.src([runMainPath + 'indexD.html', runMainPath + 'indexR.html'])
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
	// 读取B.html文件的内容
	const bHtmlContent = fs.readFileSync(runMainPath + 'index.html', 'utf8');

	// 从源.html中提取出Polyfills标签的src属性值
	const srcMatchPolyfills = bHtmlContent.match(/<script\s+src="(src\/polyfills\.bundle\.[a-zA-Z0-9]+\.js)"\s+charset="utf-8">\s*<\/script>/);
	const srcAttributeValuePolyfills = srcMatchPolyfills ? srcMatchPolyfills[1] : ''; // 提取到的src属性值

	// 从源.html中提取出SystemJS标签的src属性值
	const srcMatchSystemJS = bHtmlContent.match(/<script\s+src="(src\/system\.bundle\.[a-zA-Z0-9]+\.js)"\s+charset="utf-8">\s*<\/script>/);
	const srcAttributeValueSystemJS = srcMatchSystemJS ? srcMatchSystemJS[1] : ''; // 提取到的src属性值

	// 从源.html中提取出Import map标签的src属性值
	const srcMatchImportMap = bHtmlContent.match(/<script\s+src="(src\/import-map\.[a-zA-Z0-9]+\.json)"\s+type="systemjs-importmap"\s+charset="utf-8">\s*<\/script>/);
	const srcAttributeValueImportMap = srcMatchImportMap ? srcMatchImportMap[1] : ''; // 提取到的src属性值

	//处理入口index文件
	const srcMatchIndex = bHtmlContent.match(/System\.import\('.\/index\.[a-zA-Z0-9]+\.js'\)/);
	const srcAttributeValuesrcIndex = srcMatchIndex ? srcMatchIndex[0] : ''; // 提取到的src属性值

	//处理在indexD中的vsconsole
	const srcMatchVsconsole = bHtmlContent.match(/<script\s+src="\.\/vconsole\.min\.[a-zA-Z0-9]+\.js"><\/script>/);
	const srcAttributeValuesrcVsconsole = srcMatchVsconsole ? srcMatchVsconsole[0] : ''; // 提取到的src属性值


	gulp.src([runMainPath + 'indexD.html', runMainPath + 'indexR.html']) // 选择 index.html 文件作为源文件

		.pipe(replace(/src\/polyfills\.bundle\.[a-zA-Z0-9]+\.js/g, srcAttributeValuePolyfills))

		.pipe(replace(/src\/system\.bundle\.[a-zA-Z0-9]+\.js/g, srcAttributeValueSystemJS))

		.pipe(replace(/src\/import-map\.[a-zA-Z0-9]+\.json/g, srcAttributeValueImportMap))

		.pipe(replace(/System\.import\('.\/index\.[a-zA-Z0-9]+\.js'\)/g, srcAttributeValuesrcIndex))

		.pipe(replace(/<script\s+src="\.\/vconsole\.min\.[a-zA-Z0-9]+\.js"><\/script>/g, srcAttributeValuesrcVsconsole))

		.pipe(gulp.dest(runMainPath)) // 将处理后的 HTML 文件保存到目标目录
		.on('end', cb);
});


//将闪屏 css indexDR 拷回去
gulp.task('copy', function (cb) {
	gulp.src([runCopyPath + '*.jpg', runCopyPath + '*.png', runCopyPath + '*.css', runCopyPath + '*.html']) // 选择要拷贝文件
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
	const args = process.argv[3][2]
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
		default:
			break;
	}
	const buildTasks = gulp.series('addVersion', 'copy', 'replaceDR', 'minify-json', 'htmlmin', 'script');
	buildTasks()
	done(); // 调用回调函数，通知 Gulp 任务完成
})

// gulp.series('addVersion', 'copy', 'replaceDR', 'minify-json', 'htmlmin', 'script'));

