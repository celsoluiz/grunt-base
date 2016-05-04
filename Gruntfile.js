module.exports = function (grunt) {
    require('jit-grunt')(grunt);

    var config = {
        build: 'build',
        source: 'source'
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        config: config,

        uglify: {
            options: {
                sourceMap: true
            },
            my_target: {
                files:[{
                    expand: true,
                    cwd: '<%= config.source %>/app/scripts',
                    src: '**/*.js',
                    dest: '<%= config.build %>/app/scripts'
                }]
            }
        },
        wiredep: {
            task: {
                src: [
                    '<%= config.source %>/app/*.html',
                    '<%= config.source %>/app/content/styles/*.scss'
                ]
            }
        },
        sass: {
            options: {
                sourceMap: true
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.source %>/app/content/styles',
                    src: ['*.scss'],
                    dest: '<%= config.build %>/app/content/styles',
                    ext: '.css'
                }]
            }
        },
        postcss: {
            options: {
                map: true,
                processors: [
                    require('autoprefixer')({
                        browsers: 'last 2 versions'
                    }),
                    require('cssnano')()
                ]
            },
            dist: {
                src: '<%= config.build %>/app/content/styles/{,*/}*.css'
            }
        },
        watch: {
            styles: {
                files: ['<%= config.source %>/app/content/styles/{,*/}*.scss'],
                tasks: ['sass', 'postcss']
            },
            scripts: {
                files: ['<%= config.source %>/app/scripts/{,*/}*.js'],
                tasks: ['uglify']
            },
            bower: {
                files: ['bower_components/*'],
                tasks: ['wiredep']
            }
        },
        browserSync: {
            bsFiles: {
                src: [
                    '<%= config.source %>/app/{,*/}*.html',
                    '<%= config.source %>/app/scripts/{,*/}*.js',
                    '<%= config.source %>/app/content/styles/{,*/}*.css'
                ]
            },
            options: {
                watchTask: true,
                server: {
                    baseDir: ['<%= config.source %>/app'],
                    routes: {
                        '/bower_components': './bower_components'
                    }
                }
            }
        }
    });

    grunt.registerTask('default', ['browserSync', 'watch']);
};