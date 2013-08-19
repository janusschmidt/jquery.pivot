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
                    { src: 'ts/jquery.pivot.ts', dest: 'build/jquery.pivot.js' },
                    { src: 'ts/demo.ts', dest: 'build/demo.js' }
                ]
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'pivot.jquery.json', 'package.json', 'build/**/*.js', '!build/**/*.min.js']
        },
        uglify: {
            build: {
                files: [
                    { src: 'build/jquery.pivot.js', dest: 'build/jquery.pivot.min.js' },
                    { src: 'build/demo.js', dest: 'build/demo.min.js' }
                //{
                //    expand: true,     // Enable dynamic expansion.
                //    cwd: 'build',      // Src matches are relative to this path.
                //    src: ['**/*.*.js', '**/*.js', '!**/*.min.js'], // Actual pattern(s) to match.
                //    dest: 'build',   // Destination path prefix.
                //    ext: '.min.js',   // Dest filepaths will have this extension.
                //}
                ]
            }
        }
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['typescript', 'jshint', 'uglify']);
};