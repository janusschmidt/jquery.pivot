module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        typescript: {
            build: {
                files: [
                    { src: 'src/jquery.pivot.ts', dest: 'build/jquery.pivot.js' }
                ],
                options: {
                    module: 'amd', //or commonjs
                    target: 'es3', //or es3
                    sourcemap: true,
                    fullSourceMapPath: false,
                    declaration: true
                }
            },
            tests: {
                files: [
                        { src: 'tests/ts/spec.ts', dest: 'tests/js/spec.js' },
                        { src: 'tests/ts/startJasmineHtmlRunner.ts', dest: 'tests/js/startJasmineHtmlRunner.js' },
                        { src: 'tests/ts/testlingCIRunner.ts', dest: 'tests/js/testlingCIRunner.js' }
                ],
                options: {
                    module: 'amd', //or commonjs
                    target: 'es3', //or es3
                    sourcemap: false,
                    fullSourceMapPath: false,
                    declaration: false
                }
            },
            demo: {
                files: [{ src: 'src/*.ts', dest: 'demo'}],
                options: {
                    module: 'amd', //or commonjs
                    target: 'es3', //or es3
                    sourcemap: true,
                    fullSourceMapPath: false,
                    declaration: false
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
                    specs: 'tests/js/*spec.js'
                }
            }
        }
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jasmine');

    // Default task(s).
    grunt.registerTask('default', ['typescript', 'jshint', 'uglify', 'jasmine']);
};