
(function () {
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
    window.onload = function () {
        if (currentWindowOnload) {
            currentWindowOnload(null);
        }
        jasmineEnv.execute();
    };
})();
//# sourceMappingURL=startJasmineHtmlRunner.js.map
