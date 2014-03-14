# [gulp](https://github.com/wearefractal/gulp)-cram [![Build Status](https://secure.travis-ci.org/bclozel/gulp-cram.png?branch=master)](http://travis-ci.org/bclozel/gulp-cram)

> Assemble resources using cujoJS [cram](https://github.com/cujojs/cram/)


## Install

Install with [npm](https://npmjs.org/package/gulp-cram)

```
npm install --save-dev gulp-cram
```


## Example

Tell cram.js to inspect the main page of an app that uses a static index.html file:

```js
var gulp = require('gulp');
var cram = require('gulp-cram');
var uglify = require('gulp-uglify');

gulp.task('default', function () {

    var opts = {
        configFiles: [ 'build-options.json']
    };

    cram('./client/index.html', opts).into('main.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist'));

});
```

Instruct cram.js to inspect the run.js file (the AMD configuration file) of a web app that does not use a static html file:

```js
var gulp = require('gulp');
var cram = require('gulp-cram');
var uglify = require('gulp-uglify');

gulp.task('default', function () {

    var opts = {
        appRoot: 'mywebapp/',
        configFiles: [ 'build-options.json' ],
    };

    cram('mywebapp/run.js', opts).into('main.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});
```

Explicitly direct cram.js to create a bundle using options from a JSON file:

```js
var gulp = require('gulp');
var cram = require('gulp-cram');
var uglify = require('gulp-uglify');

gulp.task('default', function () {

    var opts = {
        configFiles: [ 'build-options.json' ],
        includes: [ 'mywebapp/curl/src/curl.js' ]
    };

    cram('', opts).into('mywebapp/app.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});
```

## API

### cram(grokfile, options).into(output, readOptions)

#### grokfile

Type: `String`

Accepts a a string indicating an HTML or JavaScript file to auto-configure.
It uses the same code inference algorithm as
[cram's command line HTML auto-configuration feature](https://github.com/cujojs/cram/blob/master/docs/options.md#html-auto-configuration).

#### options

Type: `Object`

A JavaScript object like:

```js
var options = {

    // A string representing the path of the root of the application files.
    // This would typically point at the same directory as baseUrl in your AMD config.
    // This option is unnecessary if you specify a grok parameter that references an HTML file.
    appRoot: './src/app/',

    // An array of JSON-formatted files containing AMD configurations.
    // These configuration options will override any found by the grok option.
    configFiles: [ 'cramOverrides.json', 'productionOverrides.json' ],

    // An array of the ids of modules to include in the bundle.
    includes: [ 'analytics/flurry' ],

    // An array of the ids of modules to exclude from the bundle.
    excludes: [ 'app/settings' ],

    // A string indicating the location of an AMD loader script.
    // This script will be inserted at the very beginning of the output bundle.
    loader: './src/lib/curl/loader.js'
};
```

For more details, check out [cram's CLI options](https://github.com/cujojs/cram/blob/master/docs/options.md).

#### output

Type: `String`

Accepts a string indicating path and name of the file to be streamed.

#### readOptions

Type: `Object`

A JavaScript object like:

```js
var options = {

    // A boolean that indicates if the result should be a buffer or a stream
    // Default value is 'true', so a buffer
    buffer: true
}
```

## License

MIT © Brian Clozel