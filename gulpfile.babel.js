'use strict';

import gulp from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'
import changed from 'gulp-changed'
import notifier from 'node-notifier'

const $ = gulpLoadPlugins({lazy: true})
process.setMaxListeners(0);       // Disable max listeners for gulp

const args = process.argv.splice(process.execArgv.length + 2);

let isVerbose = args.verbose     // Enable extra verbose logging with --verbose
let isProduction = args.prod     // Run extra steps with production flag --prod
let isWatching = false

gulp.task('default', ['build']);
gulp.task('build', ['build:json', 'lint:js']);

gulp.task('watch', cb => {
  let isWatching = true
  gulp.watch(['./src/**/*.json'], ['build:json']);
  gulp.watch(['./src/**/*.js'], ['build:js', 'lint:js']);
})

gulp.task('build:json', cb =>
  gulp.src('src/**/*.json')
      .pipe($.plumber({errorHandler: onError}))
      .pipe(changed('src', {extension: '.json'}))
      .pipe(gulp.dest('static'))
)

gulp.task('lint:js', cb =>
  gulp.src('src/**/*.js')
      .pipe($.plumber({errorHandler: onError}))
      .pipe($.if(!isWatching, changed('src', {extension: '.js'})))
      .pipe(verbosePrintFiles('lint-js'))
      .pipe($.jscs())
      .pipe($.jshint())
      .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
)

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