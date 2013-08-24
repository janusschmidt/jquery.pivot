module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        typescript: {
            options: {
                module: 'amd', //or commonjs
                target: 'es3', //or es3
                base_path: 'ts/',
                sourcemap: false,
                fullSourceMapPath: false,
                declaration: true
            },
            base: {
                files: [
                    { src: 'src/ts/jquery.pivot.ts', dest: 'build/jquery.pivot.js' },
                    { src: 'src/ts/demo.ts', dest: 'demo/demo.js' }
                ]
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'pivot.jquery.json', 'package.json', 'build/**/*.js', '!build/**/*.min.js', 'tests/**/*.js', '!tests/**/*.min.js', 'demo/**/*.js', '!demo/**/*.min.js']
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
                    specs: 'tests/*spec.js'
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