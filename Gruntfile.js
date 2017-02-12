module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      force: true,
      build:["dist","tmp"],
      tmp:['tmp']
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          require: 'coverage/blanket'
        },
        src: ['test/test-*.js']
      },
      coverage: {
        options: {
          reporter: 'html-cov',
          quiet: true,
          captureFile: 'coverage.html'
        },
        src: ['test/test-*.js']
      }
    },
    usemin: {
        jade: 'dist/app/views/**/*.jade',
        options: {
            assetsDirs: ['public'],
            patterns: {
                jade: require('usemin-patterns').jade
            }
        }
    },
    concat: {
      options: {
        separator: ';'
      },
      basic_and_extras: {
        files: {
        'tmp/public/js/client/app.js': ['public/js/client/app.js'],
        'tmp/public/js/client/controllers.js': ['public/js/client/controllers.js'],
        'tmp/public/js/libs/bootstrap.js': ['public/js/libs/bootstrap.js'],
        'tmp/public/js/libs/jquery-2.0.3.js': ['public/js/libs/jquery-2.0.3.js'],
        'tmp/public/js/libs/angular.js': ['public/js/libs/angular.js'],
        'tmp/public/js/libs/angular-route.js': ['public/js/libs/angular-route.js']
      },
    },
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/public/js/client/app.min.js': ['tmp/public/js/client/app.js'],
          'dist/public/js/client/controllers.min.js': ['tmp/public/js/client/controllers.js'],
          'dist/public/js/libs/bootstrap.min.js': ['tmp/public/js/libs/bootstrap.js'],
          'dist/public/js/libs/jquery-2.0.3.min.js': ['tmp/public/js/libs/jquery-2.0.3.js'],
          'dist/public/js/libs/angular.min.js': ['tmp/public/js/libs/angular.js'],
          'dist/public/js/libs/angular-route.min.js': ['tmp/public/js/libs/angular-route.js'],
        }
      }
    },
    cssmin: {
      minify: {
        expand: true,
        cwd: 'public/css/',
        src: ['*.css', '!*.min.css'],
        dest: 'dist/public/css/',
        ext: '.min.css'
      }
    },
    copy: {
      main: {
        files: [
          // includes files within path
          {expand: true, src: ['server.js','package.json'], dest: 'dist/', filter: 'isFile'},

          // includes files within path and its sub-directories
          {expand: true, src: ['app/**', 'config/**'], dest: 'dist/'},
        ]
      }
    },
    jsdoc : {
        dist : {
            src: ['app/**/*.js', 'config/**/*.js'], 
            options: {
                destination: 'dist/doc'
            }
        }
    },
    jshint: {
       options: {
        laxcomma : true,
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        },
       reporter:'checkstyle' ,
       reporterOutput: 'jshint.xml',
       ignores: [ 'public/js/libs/**/*.js']
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      src: {
        src: ['app/**/*.js', 'config/**/*.js', 'public/**/*.js']
      },
      test: {
        src: ['test/test-*.js']
      },
      ignore_warning: {
        options: {
          '-W092': true,
        },
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('usemin-patterns');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  
  grunt.registerTask('test', ['mochaTest']);

  grunt.registerTask('checkcode', ['jshint:src' , 'jshint:gruntfile', 'jshint:test']);

  grunt.registerTask('default', ['clean:build','jshint:src','mochaTest','concat','uglify','cssmin','copy','usemin','jsdoc','clean:tmp']);

};