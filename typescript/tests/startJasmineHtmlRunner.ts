/// <reference path="../definitions/jasmine.d.ts" />

declare module jasmine {
    export var JSReporter: any;
}

(() => {
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 250;
    var htmlReporter = new jasmine.HtmlReporter();
    var jsreporter = new jasmine.JSReporter();
    jasmineEnv.addReporter(htmlReporter);
    jasmineEnv.addReporter(jsreporter);
    jasmineEnv.specFilter = function (spec) {
        return htmlReporter.specFilter(spec);
    };
    var currentWindowOnload = window.onload;
    window.onload = () => {
        if (currentWindowOnload) {
            currentWindowOnload(null);
        }
        jasmineEnv.execute();
    };
})();