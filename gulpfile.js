/* 
* @Author: Marte
* @Date:   2017-09-01 09:04:05
* @Last Modified by:   Marte
* @Last Modified time: 2017-09-01 15:15:57
*/

//引入模块
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync');

//任务1：将.scss编译成.css
gulp.task('compileSass',function(){
    setTimeout(function(){
        return gulp.src('./src/sass/*.scss')
               .pipe(sass({outputStyle:'compact'})).on('error',sass.logError)
               .pipe(gulp.dest('./src/css'));
    },500);
});

//任务2：监听.scss文件修改，自动执行任务1
gulp.task('autoCompile',function(){
    gulp.watch('./src/sass/*.scss',['compileSass']);
});

//任务3：监听.html/.css/.js文件修改，自动刷新页面  并同时实现任务2功能
gulp.task('server',function(){
    browserSync({
        server:'./src/',
        files:['./src/**/*.html','./src/css/*.css','./src/js/*.js']
    });

    // 开启服务器的同时，监听sass的修改  
    gulp.watch('./src/sass/*.scss',['compileSass']);
});


//默认任务：实现一次并发执行多个gulp任务
gulp.task('default',['server']);