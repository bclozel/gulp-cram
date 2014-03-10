define(function () {

    var config = {
        baseUrl: '',
        paths: {
            curl: './curl/src/curl'
        },
        pluginPath: 'curl/plugin'
    };

    curl(config, ['tiny']).then(
        function () {
            console.log("run is loaded");
        }
    );

});