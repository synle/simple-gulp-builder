var _ = require('lodash');
//gulp libs
var gulp = require('gulp');
//css
var sass = require('gulp-sass');
//js
var browserify = require('browserify')
var babelify = require('babelify');
var aliasify = require('aliasify');
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');

//compile styles
function _compileStyles( sytlePath, destination ){
	return function(){
		return gulp.src( sytlePath )
	        .pipe( sass().on('error', sass.logError) )
	        .pipe( _getPathAsGulpConfig( destination ) );
    }
}

function _compileJs( jsPath, destination, babelifyConfig, aliasifyConfig, ignoreSourceMap ) {
	var bundledName = 'index.js';
	return function(){
		var browserifyJsPipe = browserify( {
				entries: jsPath,
				debug: true
			})
			.transform(babelify, babelifyConfig)//default {presets: ["es2015"]}
			.transform(aliasify, aliasifyConfig)//aliasify config
			.bundle()
			.pipe( source( bundledName ) );

		if( ignoreSourceMap !== true){
			//advance mode with source map
			browserifyJsPipe = browserifyJsPipe.pipe(buffer())
			    .pipe(sourcemaps.init({loadMaps: true}))
			        .pipe(uglify({
			        	mangle: false
			        }))
			        .on('error', gutil.log)
			    .pipe(sourcemaps.write('./'))
		}

		return browserifyJsPipe.pipe( _getPathAsGulpConfig( destination ) );
	}
}

//copy file from src to destination
function _copyFile( src, destination ){
	return function(){
		return gulp.src( src )
	    		.pipe( _getPathAsGulpConfig( destination ) );
	};
}

//get gulp dest regardless if inpgut is string or gulp dest object
function _getPathAsGulpConfig( path ){
	return _.isString( path ) ? gulp.dest( path ) : path;
}

module.exports = {
	compileStyles : _compileStyles,
	compileJs : _compileJs,
	copyFile : _copyFile
}

