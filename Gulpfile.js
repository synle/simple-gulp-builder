//gulp libs
var gulp = require('gulp');

//internal gulp tasks
var simpleGulpBuilder = require('simple-gulp-builder');

//config
//paths
var DEST_PATH = 'public';
var STYLES_CONFIG = [ 'src/style/index.scss' ];
var VIEWS_PAGE_CONFIG = [ 'src/html/index.html' ];
var JS_CONFIG  = [ 'src/js/index.js' ];
//config for transformation
var ALIASIFY_CONFIG =  {
    "aliases": {
      "app": "./src/js/app.js",
    },
    "replacements": {
      "@src/(\\w+)": "./src/js/$1"
    }
};

var BABELIFY_CONFIG = { presets: [ "es2015" ] };// or use {} if no babelify

//styles
gulp.task('styles', simpleGulpBuilder.compileStyles( STYLES_CONFIG, DEST_PATH ) );

//views
gulp.task('views',  simpleGulpBuilder.copyFile( VIEWS_PAGE_CONFIG, DEST_PATH ));

//js
gulp.task('js', simpleGulpBuilder.compileJs( JS_CONFIG, DEST_PATH, BABELIFY_CONFIG, ALIASIFY_CONFIG ));

//Watch task
gulp.task('watch',function() {
    return gulp.watch(
        ['src/**/*']
        , ['styles', 'views', 'js']
    );
});

gulp.task('build', ['styles', 'views', 'js']);

gulp.task('default', ['build', 'watch']);
