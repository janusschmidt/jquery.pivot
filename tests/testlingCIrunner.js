(function () {
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 250;
    var reporter = new jasmine.TapReporter();
    jasmineEnv.addReporter(reporter);
    var currentWindowOnload = window.onload;
    window.onload = function () {
        if (currentWindowOnload) {
            currentWindowOnload(null);
        }
        jasmineEnv.execute();
    };
})();
//# sourceMappingURL=testlingCIRunner.js.map
