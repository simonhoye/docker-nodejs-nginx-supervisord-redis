'use strict';

import gulp from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'
import changed from 'gulp-changed'
import notifier from 'node-notifier'
import cp from 'child_process'

process.setMaxListeners(0)       // Disable max listeners for gulp
const $ = gulpLoadPlugins({lazy: true})

const args = process.argv.splice(process.execArgv.length + 2)

let isVerbose = args.verbose     // Enable extra verbose logging with --verbose
let isProduction = args.prod     // Run extra steps with production flag --prod
let isWatching = false

const buildJS = () => {
  return gulp.src('src/**/*.js')
      .pipe($.plumber({errorHandler: onError}))
      .pipe(changed('src', {extension: '.js'}))
      // Do your build things here
      .pipe(gulp.dest('build'))
}

const buildJSON = () => {
  return gulp.src('src/**/*.json')
      .pipe($.plumber({errorHandler: onError}))
      .pipe(changed('src', {extension: '.json'}))
      // Do your build things here
      .pipe(gulp.dest('build'))
}

const lint = () => {
  return gulp.src('src/**/*.js')
      .pipe($.plumber({errorHandler: onError}))
      .pipe($.if(!isWatching, changed('src', {extension: '.js'})))
      .pipe(verbosePrintFiles('lint-js'))
      .pipe($.jscs())
      .pipe($.jshint())
      .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
}

const restart = () => {
  return cp.exec('/usr/bin/env supervisorctl restart node-server', (err, stdout, stderr) => {
    if (err) {
      console.error(`exec error: ${err}`)
      return
    }
    stdout && console.log(`stdout: ${stdout}`)
    stderr && console.log(`stderr: ${stderr}`)
  })
}

const watch = () => {
  isWatching = true
  gulp.watch(['./src/**/*.json'], buildJSON)
  gulp.watch(['./src/**/*.js'], gulp.series(gulp.parallel('build:js', 'build:json'), 'restart'))
}

const onError = err => {
    notifier.notify({
        title: err.plugin + ' Error',
        message: err.message
    });
    $.util.log(err.toString())
    $.util.beep()
    if (!isWatching) {
        process.exit(1)
    }
}

const verbosePrintFiles = taskName => {
    return $.if(isVerbose, $.print(filepath => {
        return taskName + ': ' + filepath
    }))
}

gulp.task('watch', watch)
gulp.task('lint', lint)
gulp.task('restart', restart)
gulp.task('build:js', buildJS)
gulp.task('build:json', buildJSON)
gulp.task('build', gulp.series('lint',
    gulp.parallel('build:js', 'build:json')
))
gulp.task('default', gulp.series('build', 'watch'))
