/// <reference path="../src/ts/definitions/jasmine.d.ts" />
(() => {
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 250;
    var htmlReporter = new jasmine.HtmlReporter();
    jasmineEnv.addReporter(htmlReporter);
    jasmineEnv.specFilter = function (spec) {
        return htmlReporter.specFilter(spec);
    };
    var currentWindowOnload = window.onload;
    window.onload = () => {
        if (currentWindowOnload) {
            currentWindowOnload(null);
        }

        //(<HTMLElement>document.querySelector('.version')).innerHTML = jasmineEnv.versionString();
        execJasmine();
    };

    function execJasmine() {
        jasmineEnv.execute();
    }
})();