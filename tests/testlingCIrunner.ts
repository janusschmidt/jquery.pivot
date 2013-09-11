/// <reference path="../src/ts/definitions/jasmine.d.ts" />

declare module jasmine {
    export var TapReporter: any;
}

(() => {

    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 250;
    var reporter = new jasmine.TapReporter();
    jasmineEnv.addReporter(reporter);
    jasmineEnv.specFilter = function (spec) {
        return reporter.specFilter(spec);
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
