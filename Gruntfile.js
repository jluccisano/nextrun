"use strict";

var path = require('path');

module.exports = function(grunt) {

  var config = require('./config/config');

  process.env.XUNIT_FILE = 'test-unit-results.xml';
  process.env.JUNIT_REPORT_PATH = 'test-integration-results.xml';

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  grunt.initConfig({

    // Project settings
    yeoman: {
      // configurable paths
      client: require('./bower.json').appPath || 'client',
      server: 'server',
      dist: 'dist',
      config: 'config'
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    watch: {
      karma: {
        files: ['client/js/**/*.js', 'test/client/unit/**/*Spec.js'],
        tasks: ['karma:unit:run']
      },
      protractor: {
        files: ['client/js/**/*.js', 'test/client/e2e/*Scenario.js'],
        tasks: ['protractor']
      },
      compass: {
        files: ['<%= yeoman.client %>/modules/**/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass:server', 'autoprefixer']
      },
      livereload: {
        options: {
          livereload: '<%= express.options.livereload %>'
        },
        files: [
          '<%= yeoman.server %>/{,*/}*.jade',
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.client %>/modules/**/*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      },
      js: {
        files: ['<%= yeoman.client %>/modules/**/*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= express.options.livereload %>'
        }
      },
      jsTestClient: {
        files: ['test/client/**/*Spec.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      jsTestServer: {
        files: ['test/server/**/test-*.js'],
        tasks: ['newer:jshint:test', 'mochaTest']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      express: {
        files: ['public/js/**/*.js', 'test/client/e2e/**/*Scenario.js'],
        tasks: ['express:development'],
        options: {
          spawn: false
        }
      },
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'compass:server'
      ],
      test: [
        'compass'
      ],
      dist: [
        'compass:dist',
        'imagemin',
        'svgmin'
      ]
    },

    // Automatically inject Bower components into the app
    bowerInstall: {
      app: {
        src: ['<%= yeoman.server %>/views/index.jade'],
        ignorePath: '<%= yeoman.server %>/'
      },
      sass: {
        src: ['<%= yeoman.client %>/styles/{,*/}*.{scss,sass}'],
        ignorePath: '<%= yeoman.client %>/bower_components/'
      }
    },

    /********************************** COMPILE ***************************************************/

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: '<%= yeoman.client %>/modules/main/styles',
        cssDir: '.tmp/styles',
        generatedImagesDir: '.tmp/images/generated',
        imagesDir: '<%= yeoman.client %>/modules/main/images',
        javascriptsDir: '<%= yeoman.client %>/modules/main/scripts',
        fontsDir: '<%= yeoman.client %>/modules/main/styles/fonts',
        importPath: '<%= yeoman.client %>/bower_components',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/generated',
        httpFontsPath: '/styles/fonts',
        relativeAssets: false,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      dist: {
        options: {
          generatedImagesDir: '<%= yeoman.dist %>/client/images/generated'
        }
      },
      server: {
        options: {
          debugInfo: true
        }
      }
    },

    jade: {
      compile: {
        options: {
          client: false,
          pretty: true
        },
        files: [{
          cwd: "<%= yeoman.server %>/views",
          src: "**/*.jade",
          dest: "<%= yeoman.dist %>/server/views/",
          expand: true,
          ext: ".html"
        }]
      }
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    /********************************** MINIFICATION ***************************************************/

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them

    useminPrepare: {
      html: '<%= yeoman.dist %>/server/views/index.html',
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/server/views/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/client/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>', '<%= yeoman.dist %>/client/images']
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.client %>/modules',
          src: '**/images/{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/client/images'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.client %>/modules/**/images',
          src: ['{,*/}*.svg'],
          dest: '<%= yeoman.dist %>/client/images'
        }]
      }
    },


    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>/server',
          src: ['views/{,*/}*.html'],
          dest: '<%= yeoman.dist %>/server'
        }]
      }
    },

    // ngmin tries to make the code safe for minification automatically by
    // using the Angular long form for dependency injection. It doesn't work on
    // things like resolve or inject so those have to be done manually.
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/client/scripts',
          src: [
            '*.js',
            '!<%= yeoman.client %>/modules/main/scripts/services/config.js'
          ],
          dest: '.tmp/concat/client/scripts'
        }]
      }
    },

    copy: {
      server: {
        files: [{
          expand: true,
          src: ['server/**/!{*.jade}', 'config/**', 'locales/**', 'server.js'],
          dest: '<%= yeoman.dist %>'
        }]
      },
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.client %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            'sitemap.xml',
            'modules/**/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/client/images',
          src: ['generated/*']
        }]
      }
    },

    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/client/scripts/{,*/}*.js',
            '<%= yeoman.dist %>/client/styles/{,*/}*.css',
            '<%= yeoman.dist %>/client/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= yeoman.dist %>/client/styles/fonts/*'
          ]
        }
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/server/views/**/*.html']
      }
    },

    /******************************** JS DOC **********************************************/

    jsdoc: {
      dist: {
        src: ['<%= yeoman.server %>/**/*.js', '<%= yeoman.config %>/**/*.js'],
        options: {
          destination: '<%= yeoman.dist %>/jsdoc'
        }
      }
    },


    /*************************** SERVERS *******************************************************/

    /*express: {
      options: {
        background: false,
        debug: true
      },
      development: {
        options: {
          port: 3000,
          script: 'server.js',
          node_env: 'development'
        }
      },
      test: {
        options: {
          port: 4000,
          script: 'server.js',
          node_env: 'test'
        }
      }
    },*/

    express: {
      options: {
        hostname: "0.0.0.0",
        port: "3000",
        server: "server.js",
        debug: true
      },
      livereload: {
        options: {
          bases: [path.resolve("client"), path.resolve('client/modules'), path.resolve('client/bower_components'), path.resolve(path.normalize(__dirname + "/..") + '/.tmp/')],
          livereload: true, // if you just specify `true`, default port `35729` will be used
          serverreload: true
        }
      },
      test: {
        options: {
          bases: ["<%= yeoman.dist %>", ".tmp"]
        }
      },
      dist: {
        options: {
          bases: ["<%= yeoman.dist %>"]
        }
      }
    },

    /********************************** checkcode ***************************************************/

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish'),
        reporterOutput: 'jshint.xml',
        ignores: ['<%= yeoman.client %>/lib/**/*.js', '<%= yeoman.client %>/widgets/*.js']
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.client %>/modules/**/*.js',
        '<%= yeoman.server %>/**/*.js',
        '<%= yeoman.config %>/**/*.js',
      ],
      test: {
        src: ['test/server/**/test-*.js', 'test/client/**/*Spec.js']
      },
      ignore_warning: {
        options: {
          '-W092': true,
        },
      }
    },

    /********************************** TEST PART ***************************************************/

    mochaTest: {
      unit: {
        options: {
          reporter: 'spec',
          require: 'blanket',
          quiet: false
        },
        src: ['test/server/unit/**/test-*.js']
      },
      integration: {
        options: {
          timeout: 5000,
          reporter: 'spec',
          quiet: false,
          require: 'blanket'
        },
        src: ['test/server/integration/**/test-races-search.js']
      },
      'integration-coverage': {
        options: {
          reporter: 'html-cov',
          // use the quiet flag to suppress the mocha console output
          quiet: true,
          // specify a destination file to capture the mocha
          // output (the quiet option does not suppress this)
          captureFile: 'test/server/integration/coverage/integration-coverage.html'
        },
        src: ['test/server/integration/**/test-*.js']
      },
      'unit-coverage': {
        options: {
          reporter: 'html-cov',
          // use the quiet flag to suppress the mocha console output
          quiet: true,
          // specify a destination file to capture the mocha
          // output (the quiet option does not suppress this)
          captureFile: 'test/server/unit/coverage/unit-coverage.html'
        },
        src: ['test/server/unit/**/test-*.js']
      },
      'unit-travis-cov': {
        options: {
          reporter: 'travis-cov'
        },
        src: ['test/server/unit/**/test-*.js']
      },
      'integration-travis-cov': {
        options: {
          reporter: 'travis-cov'
        },
        src: ['test/server/integration/**/test-*.js']
      }
    },

    protractor: {
      options: {
        configFile: "test/client/e2e/protractor-e2e.conf.js", // Default config file
        keepAlive: true, // If false, the grunt process stops when the test fails.
        noColor: false, // If true, protractor will not use colors in its output.
        args: {
          // Arguments passed to the command
        }
      },
      singleRun: {
        options: {
          configFile: "test/client/e2e/protractor-e2e.conf.js", // Target-specific config file
          args: {} // Target-specific arguments
        }
      }
    },

    karma: {
      unit: {
        configFile: 'test/client/spec/karma.conf.js',
        singleRun: true
      }
    },


    /********************************** SCRIPTS PART ***************************************************/

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
      },
      elasticsearch_install_test_idx: {
        command: 'sh ./scripts/es_racesidx_install.sh racesidx_test_v1 nextrun_test ' + config.test.host,
      },
      elasticsearch_install_prod_idx: {
        command: 'sh ./scripts/es_racesidx_install.sh racesidx_v1 nextrun ' + config.prod.host,
      },
      elasticsearch_start: {
        command: 'elasticsearch'
      }
    },
    bgShell: {
      _defaults: {
        bg: true
      },
      start_selenium: {
        cmd: 'node ./node_modules/protractor/bin/webdriver-manager start'
      },
      stop_selenium: {
        cmd: 'curl -s -L http://localhost:4444/selenium-server/driver?cmd=shutDownSeleniumServer'
      }
    },
    mongo_drop: {
      test: {
        'uri': 'mongodb://localhost:27017/nextrun_test'
      },
    },


  });



  /********************************** TASKS PART ***************************************************/

  grunt.registerTask('test-client', ['jshint:src', 'test-client:unit']); //'test-client:e2e'
  grunt.registerTask('test-client:unit', ['karma:unit']);
  grunt.registerTask('test-client:e2e', ['bgShell:stop_selenium', 'mongo_drop:test', 'bgShell:start_selenium', 'express:test', 'protractor:singleRun', 'bgShell:stop_selenium']);

  grunt.registerTask('test-server', ['jshint:src', 'test-server:unit', 'mochaTest:html-cov', 'mochaTest:travis-cov']); //'test-server:integration'
  grunt.registerTask('test-server:unit', ['mochaTest:unit', 'mochaTest:unit-coverage', 'mochaTest:unit-travis-cov']);
  grunt.registerTask('test-server:integration', ['shell:elasticsearch_install_test_idx', 'mochaTest:integration']); //'mochaTest:integration-coverage', 'mochaTest:integration-travis-cov'


  grunt.registerTask('checkcode', ['jshint:src', 'jshint:gruntfile', 'jshint:test']);

  grunt.registerTask('minify', ['concat', 'uglify', 'cssmin', 'imagemin']);

  grunt.registerTask('install', ['update', 'shell:selenium_install', 'copy:move_css']);

  grunt.registerTask('update', ['shell:npm_install', 'shell:bower_install']);

  grunt.registerTask('test', ['test-server', 'test-client']);

  grunt.registerTask('build', ['clean:build', 'checkcode', 'minify', 'copy:main', 'usemin', 'jsdoc', 'clean:tmp']);

  grunt.registerTask('default', ['build']);


  grunt.registerTask('generate-css', [
    'compass:dist'
  ]);



  grunt.registerTask('newbuild', [
    'clean:dist',
    'bowerInstall',
    'copy:server',
    'jade',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngmin',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'rev',
    'usemin',
    'htmlmin',
    'jsdoc'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);

  grunt.registerTask('serve', function(target) {
    if (target === 'dist') {
      return grunt.task.run(['newbuild', 'express:dist', 'express-keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'bowerInstall',
      'concurrent:server',
      'autoprefixer',
      'express:livereload',
      //'express:development'
    ]);

  });

};