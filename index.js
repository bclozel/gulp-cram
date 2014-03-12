'use strict';
var path = require('path');
var fs = require('graceful-fs');
var File = require('vinyl');
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

        // write cram results to a temp hidden file
        var cwd = process.cwd();
        var cramOutput = path.resolve(cwd, ".gulpcram.js");
        opts.output = cramOutput;

        // this is the output file name that will be streamed
        var outputPath = path.resolve(cwd, output);

        // this is the stream that will be piped to the next gulp plugin
        var resultStream = through();

        // getting a when promise on cram result
        var promise = when(cram(opts));

        // throw a gulp plugin error if cram can't complete its task
        var cramError = function(ex) {
            throw new PluginError(PLUGIN_NAME, "Cram error", ex);
        };

        // when finished, read cram temp output and push it in the result stream as a vinyl file
        var onFulfill = function() {

            if(!fs.existsSync(cramOutput)) {
                throw new PluginError(PLUGIN_NAME, "missing temporary cram output file: "+cramOutput);
            }

            var readStream = fs.createReadStream(cramOutput);
            // unlink cram temp file once it's entirely read
            resultStream.on('end', function() {
                fs.unlinkSync(cramOutput);
            });
            // push a new vynil file in the result stream
            var cramFile = new File({
                cwd: cwd,
                base: cwd,
                path: outputPath,
                contents: readStream
            });
            resultStream.end(cramFile);
        }

        promise.done(onFulfill, cramError);

        return resultStream;
    }};
};

module.exports = cramSrc;