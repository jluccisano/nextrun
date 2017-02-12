module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      force: true,
      build: ["dist", "tmp"],
      tmp: ['tmp']
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          require: 'coverage/blanket'
        },
        src: ['test/**/test-*.js']
      },
      'html-cov': {
        options: {
          reporter: 'html-cov',
          quiet: true,
          captureFile: 'coverage.html'
        },
        src: ['test/**/test-*.js']
      },
      'travis-cov': {
        options: {
          reporter: 'travis-cov'
        },
        src: ['test/**/test-*.js']
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
          'tmp/public/js/client/routingConfig.js': ['public/js/client/routingConfig.js'],
          'tmp/public/js/client/controllers.js': [
            'public/js/client/controllers.js',
            'public/js/client/controllers/*.js'
          ],
          'tmp/public/js/client/directives.js': [
            'public/js/client/directives/*.js',
          ],
          'tmp/public/js/client/services.js': [
            'public/js/client/services/*.js',
          ],
          'tmp/public/js/client/animations.js': ['public/js/client/animations.js'],
          'tmp/public/js/client/widgets/socialbuttons.js': ['public/js/client/widgets/socialbuttons.js'],
          'tmp/public/js/client/widgets/map-france.js': ['public/js/client/widgets/map-france.js'],
          'tmp/public/js/client/widgets/google-analytics.js': ['public/js/client/widgets/google-analytics.js'],
          'tmp/public/js/client/constants/regions.js': ['public/js/client/constants/regions.js'],
          'tmp/public/js/client/constants/departments.js': ['public/js/client/constants/departments.js'],
          'tmp/public/js/client/constants/typeOfRaces.js': ['public/js/client/constants/typeOfRaces.js'],
          'tmp/public/js/client/pages/home.js': ['public/js/client/pages/home.js'],
          'tmp/public/js/libs/bootstrap.js': ['public/js/libs/bootstrap.js'],
          'tmp/public/js/libs/jquery-2.0.3.js': ['public/js/libs/jquery-2.0.3.js'],
          'tmp/public/js/libs/i18next-1.7.1.js': ['public/js/libs/i18next-1.7.1.js'],
          'tmp/public/js/libs/angular.js': ['public/js/libs/angular.js'],
          'tmp/public/js/libs/angular-route.js': ['public/js/libs/angular-route.js'],
          'tmp/public/js/libs/angular-animate.js': ['public/js/libs/angular-animate.js'],
          'tmp/public/js/libs/angular-cookies.js': ['public/js/libs/angular-cookies.js'],
          'tmp/public/js/libs/angular-resource.js': ['public/js/libs/angular-resource.js'],
          'tmp/public/js/libs/angular-sanitize.js': ['public/js/libs/angular-sanitize.js'],
          'tmp/public/js/libs/angular-gm.js': ['public/js/libs/angular-gm.js'],
          'tmp/public/js/libs/angular-google-maps.js': ['public/js/libs/angular-google-maps.js'],
          'tmp/public/js/libs/dateTimeInput.js': ['public/js/libs/dateTimeInput.js'],
          'tmp/public/js/libs/datetimepicker.js': ['public/js/libs/datetimepicker.js'],
          'tmp/public/js/client/directives/gmAutocompleteDirectives.js': ['public/js/client/directives/gmAutocompleteDirectives.js'],
          'tmp/public/js/libs/enum-0.2.5.js': ['public/js/libs/enum-0.2.5.js'],
          'tmp/public/js/libs/raphael.js': ['public/js/libs/raphael.js'],
          'tmp/public/js/libs/highcharts.js': ['public/js/libs/highcharts.js'],
          'tmp/public/js/libs/highcharts-ng.js': ['public/js/libs/highcharts-ng.js'],
          'tmp/public/js/libs/underscore.js': ['public/js/libs/underscore.js'],
          'tmp/public/js/libs/moment-with-langs.js': ['public/js/libs/moment-with-langs.js'],
          'tmp/public/js/libs/bindonce.js': ['public/js/libs/bindonce.js'],
          'tmp/public/js/libs/textAngular.js': ['public/js/libs/textAngular.js'],
          'tmp/public/js/libs/bootstrap-multiselect.js': ['public/js/libs/bootstrap-multiselect.js'],
          'tmp/public/js/libs/daterangepicker.js': ['public/js/libs/daterangepicker.js'],
          'tmp/public/js/libs/ui-bootstrap-tpls-0.7.0.js': ['public/js/libs/ui-bootstrap-tpls-0.7.0.js'],
          'tmp/public/js/client/templates/angular-bootstrap-tpls-overrides.js': ['public/js/client/templates/angular-bootstrap-tpls-overrides.js'],
          'tmp/public/js/libs/less-1.7.0.js': ['public/js/libs/less-1.7.0.js']
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
          'dist/public/js/client/routingConfig.js': ['tmp/public/js/client/routingConfig.js'],
          'dist/public/js/client/controllers.min.js': ['tmp/public/js/client/controllers.js'],
          'dist/public/js/client/directives.min.js': ['tmp/public/js/client/directives.js'],
          'dist/public/js/client/services.min.js': ['tmp/public/js/client/services.js'],
          'dist/public/js/client/animations.min.js': ['tmp/public/js/client/animations.js'],
          'dist/public/js/client/widgets/socialbuttons.min.js': ['tmp/public/js/client/widgets/socialbuttons.js'],
          'dist/public/js/client/widgets/map-france.min.js': ['tmp/public/js/client/widgets/map-france.js'],
          'dist/public/js/client/widgets/google-analytics.min.js': ['tmp/public/js/client/widgets/google-analytics.js'],
          'dist/public/js/client/pages/home.min.js': ['tmp/public/js/client/pages/home.js'],
          'dist/public/js/libs/bootstrap.min.js': ['tmp/public/js/libs/bootstrap.js'],
          'dist/public/js/libs/jquery-2.0.3.min.js': ['tmp/public/js/libs/jquery-2.0.3.js'],
          'dist/public/js/libs/dateTimeInput.min.js': ['tmp/public/js/libs/dateTimeInput.js'],
          'dist/public/js/libs/datetimepicker.min.js': ['tmp/public/js/libs/datetimepicker.js'],
          'dist/public/js/client/directives/gmAutocompleteDirectives.min.js': ['tmp/public/js/client/directives/gmAutocompleteDirectives.js'],
          'dist/public/js/libs/i18next-1.7.1.min.js': ['tmp/public/js/libs/i18next-1.7.1.js'],
          'dist/public/js/libs/angular.min.js': ['tmp/public/js/libs/angular.js'],
          'dist/public/js/libs/angular-route.min.js': ['tmp/public/js/libs/angular-route.js'],
          'dist/public/js/libs/angular-animate.min.js': ['tmp/public/js/libs/angular-animate.js'],
          'dist/public/js/libs/angular-cookies.min.js': ['tmp/public/js/libs/angular-cookies.js'],
          'dist/public/js/libs/angular-resource.min.js': ['tmp/public/js/libs/angular-resource.js'],
          'dist/public/js/libs/angular-sanitize.min.js': ['tmp/public/js/libs/angular-sanitize.js'],
          'dist/public/js/libs/angular-google-maps.min.js': ['tmp/public/js/libs/angular-google-maps.js'],
          'dist/public/js/libs/angular-gm.min.js': ['tmp/public/js/libs/angular-gm.js'],
          'dist/public/js/libs/raphael.min.js': ['tmp/public/js/libs/raphael.js'],
          'dist/public/js/libs/underscore.min.js': ['tmp/public/js/libs/underscore.js'],
          'dist/public/js/libs/enums.min.js': ['tmp/public/js/libs/enum-0.2.5.js', 'tmp/public/js/client/constants/typeOfRaces.js', 'tmp/public/js/client/constants/departments.js'],
          'dist/public/js/libs/moment-with-langs.min.js': ['tmp/public/js/libs/moment-with-langs.js'],
          'dist/public/js/libs/highcharts.min.js': ['tmp/public/js/libs/highcharts.js'],
          'dist/public/js/libs/highcharts-ng.min.js': ['tmp/public/js/libs/highcharts-ng.js'],
          'dist/public/js/libs/bindonce.min.js': ['tmp/public/js/libs/bindonce.js'],
          'dist/public/js/libs/textAngular.min.js': ['tmp/public/js/libs/textAngular.js'],
          'dist/public/js/libs/bootstrap-multiselect.min.js': ['tmp/public/js/libs/bootstrap-multiselect.js'],
          'dist/public/js/libs/daterangepicker.min.js': ['tmp/public/js/libs/daterangepicker.js'],
          'dist/public/js/client/constants/regions.min.js': ['tmp/public/js/client/constants/regions.js'],
          'dist/public/js/libs/ui-bootstrap-tpls-0.7.0.min.js': ['tmp/public/js/libs/ui-bootstrap-tpls-0.7.0.js'],
          'dist/public/js/client/templates/angular-bootstrap-tpls-overrides.min.js': ['tmp/public/js/client/templates/angular-bootstrap-tpls-overrides.js'],
          'dist/public/js/libs/less-1.7.0.min.js': ['tmp/public/js/libs/less-1.7.0.js']
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
          {
            expand: true,
            src: ['server.js', 'package.json'],
            dest: 'dist/',
            filter: 'isFile'
          },

          // includes files within path and its sub-directories
          {
            expand: true,
            src: ['app/**', 'config/**', 'locales/**', 'public/fonts/**'],
            dest: 'dist/'
          },

          // includes files within path and its sub-directories
          {
            expand: true,
            src: ['public/css/font-awesome-4.0.3/**'],
            dest: 'dist/'
          },

        ]
      }
    },
    jsdoc: {
      dist: {
        src: ['app/**/*.js', 'config/**/*.js'],
        options: {
          destination: 'dist/doc'
        }
      }
    },
    jshint: {
      options: {
        laxcomma: true,
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        laxbreak: true,
        validthis: true,
        debug: true,
        devel: true,
        boss: true,
        expr: true,
        asi: true,
        globals: {
          jQuery: true
        },
        reporter: 'checkstyle',
        reporterOutput: 'jshint.xml',
        ignores: ['public/js/libs/**/*.js', 'public/js/client/widgets/*.js']
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
    },
    imagemin: {
      static: {
        options: {
          optimizationLevel: 3
        },
        files: {
          'dist/public/img/edit_screenshot.png': 'public/img/edit_screenshot.png',
          'dist/public/img/show_screenshot.png': 'public/img/show_screenshot.png',
          'dist/public/img/end.png': 'public/img/end.png',
          'dist/public/img/start.png': 'public/img/start.png',
          'dist/public/img/segment.png': 'public/img/segment.png',
          'dist/public/img/logo.png': 'public/img/logo.png'
        }
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        background: true
      }
    },
    travis: {
      configFile: 'karma.conf.js',
      singleRun: true,
      browsers: ['Chrome']
    },
    watch: {
      karma: {
        files: ['public/js/client/**/*.js', 'test/client/**/*Spec.js'],
        tasks: ['karma:unit:run']
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
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');


  grunt.registerTask('test', ['mochaTest', 'karma:unit']);

  grunt.registerTask('karmaTests', ['karma:unit','watch']);

  grunt.registerTask('checkcode', ['jshint:src', 'jshint:gruntfile', 'jshint:test']);

  grunt.registerTask('default', ['clean:build', 'jshint:src', 'mochaTest', 'concat', 'uglify', 'cssmin', 'imagemin', 'copy', 'usemin', 'jsdoc', 'clean:tmp']);

};