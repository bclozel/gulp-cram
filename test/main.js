'use strict';
var es = require("event-stream");
var path = require("path");
var fs = require("graceful-fs");
var should = require("should");
var cram = require('../index');
var stream = require('stream');

describe('cram()', function () {

    function streamFromCram(input, opts, output) {
        return cram(input, opts).into(output);
    }

    function expect(check) {

        var checkFileName = function(filename) {
            return function(file) {
                path.join(__dirname, filename).should.be.eql(file.path);
            }
        };

        var verify = (typeof check === "string") ? checkFileName(check) : check;

        function run(input, opts, output, done) {
            var stream = streamFromCram(input, opts, output);
            var resultFile;

            stream.on("end", function(){
                verify(resultFile);
                done();
            });

            stream.pipe(es.map(function(file, callback){
                resultFile = file;
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

    it('should cram resources into a bundle with the right name', function (done) {
        expect(
            "../out.js"
        ).fromCram("./test/fixtures/run.js", {}, "./out.js").when(done);
    });

    it('should cram resources into a bundle, using loaders', function (done) {
        var opts = { includes: [ 'curl/loader/legacy', 'curl/loader/cjsm11' ]};
        expect("../out.js").fromCram("./test/fixtures/run.js", opts, "./out.js").when(done);
    });

    it('should not leave out a temporary file', function (done) {
        cram("./test/fixtures/run.js", {}).into("./out.js")
            .on("end", function(){
                fs.existsSync(path.resolve("./gulpcram.js")).should.be.false;
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