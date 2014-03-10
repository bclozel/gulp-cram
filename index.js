'use strict';
var path = require('path');
var fs = require('fs');
var File = require('vinyl');
var gulp = require('gulp');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var through = require('through');
var when = require('when');
var cram = require('cram');


var cramSrc = function(filename, opts) {

    var PLUGIN_NAME = "gulp-cram";

    opts.grok = filename;

    return { into: function(output) {

        if(!output) {
            throw new PluginError(PLUGIN_NAME, "output filename must not be null");
        }
        var cwd = process.cwd();
        var outputPath = path.resolve(cwd, output);
        opts.output = outputPath;

        var stream = through();
        var promise = when(cram(opts));

        var cramError = function(ex) {
            throw new PluginError(PLUGIN_NAME, "Cram error", ex);
        };

        var onFulfill = function() {

            if(!fs.existsSync(outputPath)) {
                throw new PluginError(PLUGIN_NAME, "missing Cram output file: "+outputPath);
            }
            var readStream = fs.createReadStream(outputPath);
            var cramFile = new File({
                cwd: cwd,
                base: cwd,
                path: outputPath,
                contents: readStream
            });
            stream.end(cramFile);
        }

        //TODO: unlink output file after stream is closed?

        promise.done(onFulfill, cramError);

        return stream;
    }};
};

module.exports = cramSrc;