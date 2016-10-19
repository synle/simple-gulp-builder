# simple-gulp-builder
Simple gulp job that eases out issue with your gulp build.


## To install
```
npm install --save-dev simple-gulp-builder
```


## To get sample Gulp.js file in your repo
```
curl -so https://raw.githubusercontent.com/synle/simple-gulp-builder/master/Gulp.js.sample > Gulpfile.js
mkdir -p src/style src/html src/js;
touch src/style/index.scss src/html/index.html src/js/index.js;
```


## Note for import and require paths
```
There are 2 ways to import:

1. Global styles. Change ALIASIFY_CONFIG.aliases to be
	{
		aliases : {
			app : './src/js/app.js'
		}
	}

	With this you can simply use the alias as regardless of where this is called, the path will simply converted at build time.
	var app = require('app')

	instead of, note that this relative path will become very messy relative path
	var app = require('./src/js/app.js')

2. replacement style, this allows you to have a prefix, in my example, I used @src, but this will translate to the relative prefix path at build time. The config is as
	//note that I point @src to ./src/js/
	{
		"replacements": {
      		"@src/(\\w+)": "./src/js/$1"
    	}
	}


	This will make your import as followed
		var FolderStore = require('@src/lib/store/folderStore');


	Instead of messy relative path as
		var FolderStore = require('../../lib/store/folderStore');
```



## Sample Gulp Build code (Gulpfile.js)
```
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
gulp.task('styles', simpleGulpBuilder.compileStyles( STYLES_CONFIG, DEST_PATH, 'app.css' ) );

//views
gulp.task('views',  simpleGulpBuilder.copyFile( VIEWS_PAGE_CONFIG, DEST_PATH ));

//js
gulp.task('js', simpleGulpBuilder.compileJs( JS_CONFIG, DEST_PATH, 'app.js', BABELIFY_CONFIG, ALIASIFY_CONFIG ));

//Watch task
gulp.task('watch',function() {
	return gulp.watch(
		['src/**/*']
		, ['styles', 'views', 'js']
	);
});

gulp.task('build', ['styles', 'views', 'js']);

gulp.task('default', ['build', 'watch']);
```
