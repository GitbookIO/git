var path = require("path");

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-gitbook');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.initConfig({
        'gitbook': {
            development: {
                dest: path.join(__dirname, ".grunt/gitbook"),
                input: "./",
                title: "Learn Git",
                description: "The entire Pro Git book.",
                github: "GitbookIO/gitbook"
            }
        },
        'gh-pages': {
            options: {
                base: '.grunt/gitbook'
            },
            src: ['**']
        },
        'clean': {
            files: '.grunt'
        },
        'connect': {
            server: {
                options: {
                    port: 4000,
                    base: '.grunt/gitbook'
                }
            }
        }
    });

    grunt.registerTask('test', [
        'gitbook',
        'connect',
        'clean'
    ]);
    grunt.registerTask('publish', [
        'gitbook',
        'gh-pages',
        'clean'
    ]);
    grunt.registerTask('default', 'gitbook');
};