//使用严格模式的js。保证js的严谨，作为一个好习惯。
'use strict';

//使用require引入所有需要的模块，这是node.js语法，不了解的话记住就行了。
    //gulp
var gulp        = require('gulp'),
    // 公共页面服用
    proxy = require('http-proxy-middleware'),
    fileinclude  = require('gulp-file-include'),
    minifyCss = require('gulp-minify-css'),

    //多浏览器多设备同步&自动刷新
    browserSync = require('browser-sync').create(),
    SSI         = require('browsersync-ssi'),
    //整合文件
    concat      = require('gulp-concat'),
    //混淆js   暂时没用到
    uglify = require('gulp-uglify'),
    //压缩js
    minify      = require('gulp-minify'),
    //错误处理插件plumber
    plumber     = require('gulp-plumber'),
    //compass 用来编译sass
    compass     = require('gulp-compass'),
    //clean 用来删除文件
    clean       = require('gulp-clean'),
    //压缩文件
    zip         = require('gulp-zip'),
    //控制task中的串行和并行。这个很重要，它能够严格规定task的执行顺序，否则gulp默认并行，有些时候会产生问题。如先清空再重建文件，可能重建过程中又清空了。
    runSequence = require('gulp-run-sequence');
//上边引入模块之后，下面开始编写任务:
var proxyMiddleware = require('http-proxy-middleware');

var revCollector = require('gulp-rev-collector');//路径替换

    // 替换文件名称用md5
var  rev = require('gulp-rev');




gulp.task('serve', function() {
    //使用browserSync创建服务器，自动打开浏览器并打开./dist文件夹中的文件（默认为index.html）
var middleware = proxyMiddleware(['/a'], {
    target: 'http://api.botue.com', 
    changeOrigin: true,
    pathRewrite: {
            '^/a' : '',     // rewrite path 
        },
});
   browserSync.init({
        server: {
            baseDir:["./dist"],
            middleware:middleware
        }
    });
    //监听各个目录的文件，如果有变动则执行相应的任务操作文件
    gulp.watch("app/css/**/*.css", ['compass']);
    gulp.watch("app/js/**/*.js", ['js']);
    gulp.watch("app/**/*.html", ['html']);
    //如果有任何文件变动，自动刷新浏览器
    gulp.watch("dist/**/*.html").on("change",browserSync.reload);
});

gulp.task('fileinclude', function() {
    // 适配page中所有文件夹下的所有html，排除page下的include文件夹中html
    gulp.src(['app/**/*.html','!app/include/**.html'])
        .pipe(fileinclude({
          prefix: '@@',
          basepath: '@file'
        }))
    .pipe(gulp.dest('dist'));
});



gulp.task('compass', function (){
    return gulp.src('app/css/**/*.css')
        // .pipe(concat())//合成到一个css
        .pipe(concat('style.css'))//合成到一个css
        .pipe(minifyCss())//压缩css到一样
        .pipe(concat('style.css'))//压缩后的css
        .pipe(gulp.dest('dist/css'))
        //自动刷新浏览器
        .pipe(browserSync.stream());
});




//js任务，将js压缩后放入dist。该任务要在clean-scripts任务完成后再执行
gulp.task('js', function(){
        //首先取得app/javascript下的所有后缀为.js的文件（**/的意思是包含所有子文件夹）
    return gulp.src('app/js/**/*.js')
        //错误管理模块
        .pipe(plumber())
        //目前没用混淆，不方便调试
        //.pipe(uglify())    
        //js压缩
        .pipe(minify())
        //输出到dist/javascript
        .pipe(gulp.dest("dist/js"))
        //自动刷新浏览器
        .pipe(browserSync.stream());
});



//html任务，目前什么都没做。只是单纯的把所有html从开发环境app复制到测试环境dist
gulp.task('html', function() {
    return gulp.src("app/*.html")
        .pipe(plumber())        
        .pipe(gulp.dest("dist/"))
        .pipe(browserSync.stream());
});

//publish任务，需要的时候手动执行，将dist中的文件打包压缩放到release中。
gulp.task('publish', function(){
        //取得dist文件夹中的所有文件
    return gulp.src('dist/**/*')
        //错误处理模块
        .pipe(plumber())
        //压缩成名为publish.zip的文件
        .pipe(zip('publish.zip'))
        //放入release文件夹
        .pipe(gulp.dest('release'))
});
//clean任务：清空dist文件夹，下边重建dist的时候使用
gulp.task('clean', function () {
  return gulp.src('dist/*', {read: false})
    .pipe(clean());
});




gulp.task('minifyjsmd5', function() {
    gulp.src('app/js/**/*.js')
        // .pipe(concat('build.min.js'))//压缩后的js
        .pipe(uglify())//压缩js到一行
        .pipe(rev())//文件名加MD5后缀
        .pipe(gulp.dest('dist/js'))//输出到js目录
        .pipe(rev.manifest('rev-js-manifest.json'))////生成一个rev-manifest.json
        .pipe(gulp.dest('rev'));//将 rev-manifest.json 保存到 rev 目录内
});

gulp.task('rev', function() {
    //html，针对js,css,img
    gulp.src(['rev/**/*.json', 'app/**/*.html'])
        .pipe(revCollector({replaceReved:true }))
        .pipe(gulp.dest('dist/'));
});






//redist任务：需要时手动执行，重建dist文件夹：首先清空，然后重新处理所有文件
gulp.task('redist',function(){
    //先运行clean，然后并行运行html,js,compass
    runSequence('clean',['fileinclude','js','compass']);
});
//建立一个名为default的默认任务。当你在gitbash中执行gulp命令的时候，就会
gulp.task('default', function(){
    //先运行redist，启动服务器
    runSequence('redist','serve');
});