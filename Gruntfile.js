module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        requirejs: {
            compile: {
                options: {
                    out: "uscss.js",
                    optimize: "none",
                    name: "uscss",
                    baseUrl: 'dev',
                    include: 'requireLib',
                    paths: {
                        'requireLib': '../require',
                        'uscss': 'uscss'
                    },
                    uglify: {
                        max_line_length: 130
                    }
                }
            }
        },
        watch: {
            requirejs: {
                files: ['dev/*.js'],
                tasks: ['requirejs']
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
};
