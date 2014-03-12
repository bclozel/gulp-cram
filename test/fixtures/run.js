define(function () {

    var config = {
        baseUrl: '',
        paths: {
            curl: './curl/src/curl'
        },
        pluginPath: 'curl/plugin'
    };

    curl(config, ['tiny', 'foo']).then(
        function () {
            console.log("run is loaded");
        }
    );

});