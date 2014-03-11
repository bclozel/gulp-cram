'use strict';
var gutil = require('gulp-util');
var es = require("event-stream");
var path = require("path");
var fs = require("fs");
var should = require("should");
var cram = require('../index');

describe('cram()', function () {

    function streamFromCram(input, opts, output) {
        return cram(input, opts).into(output);
    }

    function expect(filenames) {
        var expectedFiles = [].concat(filenames).map(function(filename) {
            return path.join(__dirname, filename);
        });

        function run(input, opts, output, done) {
            var stream = streamFromCram(input, opts, output);
            var srcFiles = [];

            stream.on("end", function(){
                srcFiles.should.be.eql(expectedFiles);
                done();
            });

            stream.pipe(es.map(function(file, callback){
                srcFiles.push(file.path);
                callback();
            }));
        }

        return {
            fromCram: function(input, opts, output) {
                return {
                    when: function(done) { run(input, opts, output, done); }
                }
            }
        }
    }

    it('should cram resources into a bundle', function (done) {
        expect([
            "../out.js"
        ]).fromCram("./test/fixtures/run.js", {}, "./out.js").when(done);
    });

    it('should not leave out a temporary file', function (done) {
        cram("./test/fixtures/run.js", {}).into("./out.js")
            .on("end", function(){
                fs.existsSync(path.resolve("./out.js")).should.be.false;
                done();
        });

    });

    it("should throw an exception if output filename is not provided", function(done) {
        try {
            streamFromCram('./test/fixtures/run.js', {}, null);
            should.fail("due to output not being provided");
        } catch (e) {
            e.message.should.containEql("output filename must not be null");
            done();
        }
    });

});