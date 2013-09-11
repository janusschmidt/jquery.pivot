(function () {
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 250;
    var reporter = new jasmine.TapReporter();
    jasmineEnv.addReporter(reporter);
    jasmineEnv.specFilter = function (spec) {
        return reporter.specFilter(spec);
    };
    var currentWindowOnload = window.onload;
    window.onload = function () {
        if (currentWindowOnload) {
            currentWindowOnload(null);
        }

        execJasmine();
    };

    function execJasmine() {
        jasmineEnv.execute();
    }
})();
//# sourceMappingURL=testlingCIRunner.js.map
