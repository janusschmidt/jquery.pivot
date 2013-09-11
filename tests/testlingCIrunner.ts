/// <reference path="../src/ts/definitions/jasmine.d.ts" />

declare module jasmine {
    export var TapReporter: any;
}

(() => {
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 250;
    var reporter = new jasmine.TapReporter();
    jasmineEnv.addReporter(reporter);
    var currentWindowOnload = window.onload;
    window.onload = () => {
        if (currentWindowOnload) {
            currentWindowOnload(null);
        }
        jasmineEnv.execute();
    };
})();
