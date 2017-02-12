module.exports = function(grunt) {

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      force: true,
      build: ["dist", "tmp"],
      tmp: ['tmp']
    },
    mochaTest: {
      unit: {
        options: {
          reporter: 'spec',
          require: 'blanket'
        },
        src: ['test/server/unit/**/test-*.js']
      },
      integration: {
        options: {
          reporter: 'spec',
          require: 'blanket'
        },
        src: ['test/server/integration/**/test-*.js']
      },
      coverage: {
        options: {
          reporter: 'html-cov',
          // use the quiet flag to suppress the mocha console output
          quiet: true,
          // specify a destination file to capture the mocha
          // output (the quiet option does not suppress this)
          captureFile: 'coverage.html'
        },
        src: ['test/server/unit/**/test-*.js', 'test/server/integration/**/test-*.js']
      },
      'html-cov': {
        options: {
          reporter: 'html-cov',
          quiet: true,
          captureFile: 'coverage.html'
        },
        src: ['test/server/unit/**/test-*.js', 'test/server/integration/**/test-*.js']
      },
      'travis-cov': {
        options: {
          reporter: 'travis-cov',
        },
        src: ['test/server/unit/**/test-*.js', 'test/server/integration/**/test-*.js']
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
          'tmp/public/js/app.js': ['public/js/app.js'],
          'tmp/public/js/routingConfig.js': ['public/js/routingConfig.js'],
          'tmp/public/js/controllers.js': [
            'public/js/controllers.js',
            'public/js/controllers/*.js'
          ],
          'tmp/public/js/directives.js': [
            'public/js/directives/*.js',
          ],
          'tmp/public/js/services.js': [
            'public/js/services/*.js',
          ],
          'tmp/public/js/animations.js': ['public/js/animations.js'],
          'tmp/public/js/widgets/socialbuttons.js': ['public/js/widgets/socialbuttons.js'],
          'tmp/public/js/widgets/map-france.js': ['public/js/widgets/map-france.js'],
          'tmp/public/js/widgets/google-analytics.js': ['public/js/widgets/google-analytics.js'],
          'tmp/public/js/constants/regions.js': ['public/js/constants/regions.js'],
          'tmp/public/js/constants/departments.js': ['public/js/constants/departments.js'],
          'tmp/public/js/constants/typeOfRaces.js': ['public/js/constants/typeOfRaces.js'],
          'tmp/public/js/pages/home.js': ['public/js/pages/home.js'],
          'tmp/public/js/templates/angular-bootstrap-tpls-overrides.js': ['public/js/templates/angular-bootstrap-tpls-overrides.js'],
          'tmp/public/js/directives/gmAutocompleteDirectives.js': ['public/js/directives/gmAutocompleteDirectives.js'],


          //To be minify
          'tmp/public/lib/underscore.js': ['bower_components/underscore/underscore.js'],
          'tmp/public/lib/bootstrap-multiselect.js': ['bower_components/bootstrap-multiselect/js/bootstrap-multiselect.js'],
          'tmp/public/lib/daterangepicker.js': ['bower_components/bootstrap-daterangepicker/daterangepicker.js'],
          'tmp/public/lib/datetimepicker.js': ['bower_components/angular-bootstrap-datetimepicker/src/js/datetimepicker.js'],
          'tmp/public/lib/dateTimeInput.js': ['bower_components/angular-date-time-input/src/dateTimeInput.js'],
          'tmp/public/lib/highcharts.js': ['bower_components/highcharts.com/js/highcharts.src.js'],



          'tmp/public/lib/textAngular.js': ['public/lib/textAngular.js'],
          'tmp/public/lib/enum-0.2.5.js': ['public/lib/enum-0.2.5.js'],



        },
      },
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/public/js/app.min.js': ['tmp/public/js/app.js'],
          'dist/public/js/routingConfig.js': ['tmp/public/js/routingConfig.js'],
          'dist/public/js/controllers.min.js': ['tmp/public/js/controllers.js'],
          'dist/public/js/directives.min.js': ['tmp/public/js/directives.js'],
          'dist/public/js/services.min.js': ['tmp/public/js/services.js'],
          'dist/public/js/animations.min.js': ['tmp/public/js/animations.js'],
          'dist/public/js/widgets/socialbuttons.min.js': ['tmp/public/js/widgets/socialbuttons.js'],
          'dist/public/js/widgets/map-france.min.js': ['tmp/public/js/widgets/map-france.js'],
          'dist/public/js/widgets/google-analytics.min.js': ['tmp/public/js/widgets/google-analytics.js'],
          'dist/public/js/pages/home.min.js': ['tmp/public/js/pages/home.js'],
          'dist/public/js/directives/gmAutocompleteDirectives.min.js': ['tmp/public/js/directives/gmAutocompleteDirectives.js'],
          'dist/public/js/constants/regions.min.js': ['tmp/public/js/constants/regions.js'],
          'dist/public/js/templates/angular-bootstrap-tpls-overrides.min.js': ['tmp/public/js/templates/angular-bootstrap-tpls-overrides.js'],



          'dist/public/lib/underscore.min.js': ['tmp/public/lib/underscore.js'],
          'dist/public/lib/bootstrap-multiselect.min.js': ['tmp/public/lib/bootstrap-multiselect.js'],
          'dist/public/lib/daterangepicker.min.js': ['tmp/public/lib/daterangepicker.js'],
          'dist/public/lib/datetimepicker.min.js': ['tmp/public/lib/datetimepicker.js'],
          'dist/public/lib/dateTimeInput.min.js': ['tmp/public/lib/dateTimeInput.js'],
          'dist/public/lib/highcharts.min.js': ['tmp/public/lib/highcharts.js'],



          'dist/public/lib/enums.min.js': ['tmp/public/lib/enum-0.2.5.js', 'tmp/public/js/constants/typeOfRaces.js', 'tmp/public/js/constants/departments.js'],

          'dist/public/lib/textAngular.min.js': ['tmp/public/lib/textAngular.js'],


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
      move_css: {
        files: [{
          expand: true,
          src: [
            'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css',
            'bower_components/angular-bootstrap-datetimepicker/src/css/datetimepicker.css'
          ],
          dest: 'public/css'
        }]
      },
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
            src: [
              'bower_components/font-awesome/css/font-awesome.min.css',
              'bower_components/bootstrap/dist/css/bootstrap.min.css'

            ],
            dest: 'dist/public/css/'
          },
          //copy all minify libs to public/js/lib
          {
            expand: true,
            flatten: true,
            src: [
              'bower_components/angular/angular.min.js',
              'bower_components/angular-route/angular-route.min.js',
              'bower_components/angular-animate/angular-animate.min.js',
              'bower_components/angular-cookies/angular-cookies.min.js',
              'bower_components/angular-resource/angular-resource.min.js',
              'bower_components/angular-sanitize/angular-sanitize.min.js',
              'bower_components/angular-google-maps/dist/angular-google-maps.min.js',
              'bower_components/highcharts-ng/dist/highcharts-ng.min.js',
              'bower_components/jquery/dist/jquery.min.js',
              'bower_components/bootstrap/dist/js/bootstrap.min.js',
              'bower_components/i18next/i18next.min.js',
              'bower_components/AngularGM/angular-gm.min.js',
              'bower_components/moment/min/moment-with-langs.min.js',
              'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
              'bower_components/x2js/xml2json.min.js',
              'bower_components/font-awesome/css/font-awesome.min.css'
            ],
            dest: 'dist/public/lib/'
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
        ignores: ['public/lib/**/*.js', 'public/js/widgets/*.js']
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
        background: false,
        singleRun: true,
        autoWatch: false
      },
      e2e: {
        configFile: 'karma-e2e.conf.js',
        singleRun: true
      },
    },
    travis: {
      configFile: 'karma.conf.js',
      singleRun: true,
      browsers: ['Chrome']
    },
    watch: {
      express: {
        files: ['public/js/**/*.js', 'test/client/e2e/**/*Scenario.js'],
        tasks: ['express:test'],
        options: {
          spawn: false
        }
      },
      karma: {
        files: ['public/js/**/*.js', 'test/client/unit/**/*Spec.js'],
        tasks: ['karma:unit:run']
      },
      protractor: {
        files: ['public/js/**/*.js', 'test/client/e2e/*Scenario.js'],
        tasks: ['protractor']
      }
    },
    express: {
      options: {
        background: true,
        port: 3000,
        debug: false
      },
      test: {
        options: {
          script: 'server.js',
          node_env: 'test'
        }
      }
    },
    protractor: {
      options: {
        configFile: "protractor-e2e.conf.js", // Default config file
        keepAlive: true, // If false, the grunt process stops when the test fails.
        noColor: false, // If true, protractor will not use colors in its output.
        args: {
          // Arguments passed to the command
        }
      },
      singleRun: {
        options: {
          configFile: "protractor-e2e.conf.js", // Target-specific config file
          args: {} // Target-specific arguments
        }
      }
    },
    shell: {
      options: {
        stdout: true
      },
      selenium_install: {
        command: 'node ./node_modules/protractor/bin/webdriver-manager update'
      },
      npm_install: {
        command: 'npm install'
      },
      bower_install: {
        command: 'bower install'
      }
    },
    bgShell: {
      _defaults: {
        bg: true
      },
      start_selenium: {
        cmd: 'node ./node_modules/protractor/bin/webdriver-manager start'
      }
    }
  });


  grunt.registerTask('test-client', ['jshint:src', 'test-client:unit', 'test-client:e2e']);
  grunt.registerTask('test-client:unit', ['karma:unit']);
  grunt.registerTask('test-client:e2e', ['bgShell:start_selenium', 'express:test', 'protractor:singleRun']);

  grunt.registerTask('test-server', ['jshint:src', 'test-server:unit', 'mochaTest:html-cov', 'mochaTest:travis-cov']);
  grunt.registerTask('test-server:unit', ['mochaTest:unit']);
  grunt.registerTask('test-server:integration', ['mochaTest:integration']);

  grunt.registerTask('checkcode', ['jshint:src', 'jshint:gruntfile', 'jshint:test']);

  grunt.registerTask('minify', ['concat', 'uglify', 'cssmin', 'imagemin']);

  grunt.registerTask('install', ['update', 'shell:selenium_install', 'copy:move_css']);

  grunt.registerTask('update', ['shell:npm_install', 'shell:bower_install']);


  grunt.registerTask('build', ['clean:build', 'checkcode', 'test-server', 'test-client', 'minify', 'copy:main', 'usemin', 'jsdoc', 'clean:tmp']);



  grunt.registerTask('default', ['build']);

};