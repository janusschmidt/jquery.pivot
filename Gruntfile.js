module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        typescript: {
            build: {
                files: [
                    { src: 'typescript/src/jquery.pivot.ts', dest: 'build/jquery.pivot.js' }
                ],
                options: {
                    module: 'amd', //or commonjs
                    target: 'es3', //or es3
                    sourcemap: true,
                    fullSourceMapPath: false,
                    declaration: true
                }
            },
            dev: {
                files: [{ src: 'typescript/**/*.ts', dest: 'js' }],
                options: {
                    module: 'amd', //or commonjs
                    target: 'es3', //or es3
                    sourcemap: true,
                    fullSourceMapPath: false,
                    declaration: false,
                    base_path: 'typescript'
                }
            }
        },
        jshint: {
            all: ['Gruntfile.js',
                'pivot.jquery.json',
                'package.json',
                'demo/**/*.js',
                'build/**/*.js', '!build/**/*.min.js',
                'tests/**/*.js', '!tests/**/*.min.js'],
            options: {
                smarttabs: true /*supress warnings about mixed spaces and tabs*/
            }
        },
        uglify: {
            build: {
                files: [
                    { src: 'build/jquery.pivot.js', dest: 'build/jquery.pivot.min.js' }
                ]
            }
        },
        jasmine: {
            jquerypivot: {
                src: 'build/jquery.pivot.min.js',
                options: {
                    vendor: 'tools/jquery.min.js',
                    specs: 'js/tests/*spec.js'
                }
            }
        },
        //Remember to have java installed and in your environment path
        //Remember to set key in environment
        'saucelabs-jasmine': {
            all: {
                options: {
                    username: 'janusschmidt',
                    key: 'secret-saucelab-api-key', //optinally set up username and key in env. read about it on grunt-saucelabs.
                    urls: ['http://localhost/jquery.pivot/tests/run.html'],
                    build: '<%= pkg.version %>',
                    tunnelTimeout: 5,
                    concurrency: 3,
                    browsers: [
                        { platform: 'Windows XP', browserName: 'internet explorer', version: '6' },
                        { platform: 'Windows XP', browserName: 'internet explorer', version: '7' },
                        { platform: 'Windows 7', browserName: 'internet explorer', version: '8' },
                        { platform: 'Windows 7', browserName: 'internet explorer', version: '9' },
                        { platform: 'Windows 7', browserName: 'internet explorer', version: '10' },
                        { platform: 'Windows 7', browserName: 'internet explorer', version: '' },
                        { platform: 'Windows 7', browserName: 'chrome', version: '' },
                        { platform: 'Windows 7', browserName: 'firefox', version: '' },
                        { platform: 'Windows 7', browserName: 'opera', version: '' },
                        { platform: 'OS X 10.9', browserName: 'safari', version: '' },
                        { platform: 'OS X 10.9', browserName: 'iphone', version: '' },
                        { platform: 'OS X 10.8', browserName: 'safari', version: '' },
                        { platform: 'linux', browserName: 'android', version: '' }
                    ],
                    testname: "jasmine tests"
                }
            }
        },
        jquerymanifest: {
            options: {
                overrides: {
                    name: "pivot",
                    dependencies: { "jquery": ">=1.7.0" },
                    "keywords": ["data", "pivot", "pivottable", "table", "analyze"],
                }
            }
        }
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-saucelabs');
    grunt.loadNpmTasks('grunt-jquerymanifest');

    // Default task(s).
    grunt.registerTask('default', ['typescript', 'jquerymanifest', 'jshint', 'uglify', 'jasmine']);

    //Run tests in target browsers
    grunt.registerTask('sauce', ['saucelabs-jasmine']);
};