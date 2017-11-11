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

var cheerio = require("gulp-cheerio")

    // 替换文件名称用md5
var  rev = require('gulp-rev');

// var baseurl = './app/assets/'
var jquery 		="./app/assets/jquery/jquery.js"
var bootstrap 	="./app/assets/bootstrap/js/bootstrap.js"
var nprogress 	="./app/assets/nprogress/nprogress.js"
var echarts 	="./app/assets/echarts/echarts.js"
var common 		="./app/js/common.js"

gulp.task('mergejs',function(){
	gulp.src([jquery,bootstrap,nprogress,echarts,common])
		.pipe(concat('build.min.js'))//压缩后的js
        .pipe(uglify())//压缩js到一行
        .pipe(rev())//文件名加MD5后缀
        .pipe(gulp.dest('dist/js'))//输出到js目录
        .pipe(rev.manifest('rev-js-manifest.json'))////生成一个rev-manifest.json
        .pipe(gulp.dest('rev'));
});


gulp.task('sharu',function(){
	var jscriptName = require('./rev/rev-js-manifest.json')['build.min.js'];
	 var scroptHtml = `<script src=./${jscriptName}></script>`
	 gulp.src('app/index.html')
        .pipe(cheerio(function ($) {
            var a = $('script.a');
            $('script').remove();
            $('link').remove();
            $('body').append(a);
            $('body').append(scroptHtml);
            // $('head').append('<link rel="stylesheet" href="app.full.min.css">');
        }))
        .pipe(gulp.dest('dist/'));
	
})
