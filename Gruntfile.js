"use strict";

module.exports = function(grunt) {

  process.env.XUNIT_FILE = "test-unit-results.xml";
  process.env.JUNIT_REPORT_PATH = "test-integration-results.xml";

  // Load grunt tasks automatically
  require("load-grunt-tasks")(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require("time-grunt")(grunt);

  grunt.initConfig({

    // Project settings
    yeoman: {
      // configurable paths
      client: require("./bower.json").appPath || "client",
      server: "server",
      dist: "dist",
      config: "config",
      test: "test"
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            ".tmp",
            "<%= yeoman.dist %>/*",
            "!<%= yeoman.dist %>/.git*"
          ]
        }]
      },
      server: ".tmp"
    },

    watch: {
      js: {
        files: ["<%= yeoman.client %>/**/*", "<%= yeoman.server %>/**/*", ".tmp/styles/{,*/}*.css"],
        tasks: ["newer:jshint:all", "express:development"]
      },
      compass: {
        files: ["<%= yeoman.client %>/modules/**/styles/{,*/}*.{scss,sass}"],
        tasks: ["compass:server", "autoprefixer"]
      },
      testClient: {
        files: ["<%= yeoman.test %>/client/spec/**/*Spec.js"],
        tasks: ["newer:jshint:test", "karma:unit"]
      },
      testServer: {
        files: ["<%= yeoman.test %>/server/unit/**/test-*.js"],
        tasks: ["newer:jshint:test", "mochaTest"]
      }
    },

    nggettext_extract: {
      pot: {
        files: {
          "locales/template.pot": [".tmp/generated/views/**/*.html", "<%= yeoman.client %>/modules/**/*.js"]
        }
      },
    },

    nggettext_compile: {
      all: {
        files: {
          "<%= yeoman.client %>/modules/main/scripts/locales/locales.js": ["locales/*.po"]
        }
      },
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        "compass:server"
      ],
      test: [
        "compass"
      ],
      dist: [
        "compass:dist",
        "imagemin",
        "svgmin"
      ]
    },

    // Automatically inject Bower components into the app
    bowerInstall: {
      app: {
        src: ["<%= yeoman.server %>/views/index.jade"],
        ignorePath: "<%= yeoman.server %>/"
      },
      sass: {
        src: ["<%= yeoman.client %>/styles/{,*/}*.{scss,sass}"],
        ignorePath: "<%= yeoman.client %>/bower_components/"
      }
    },

    /********************************** COMPILE ***************************************************/

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: "<%= yeoman.client %>/modules/main/styles",
        cssDir: ".tmp/styles",
        generatedImagesDir: ".tmp/images/generated",
        imagesDir: "<%= yeoman.client %>/modules/main/images",
        javascriptsDir: "<%= yeoman.client %>/modules/main/scripts",
        fontsDir: "<%= yeoman.client %>/fonts",
        importPath: "<%= yeoman.client %>/bower_components",
        httpImagesPath: "/images",
        httpGeneratedImagesPath: "/images/generated",
        httpFontsPath: "/fonts",
        relativeAssets: false,
        assetCacheBuster: false,
        raw: "Sass::Script::Number.precision = 10\n"
      },
      dist: {
        options: {
          generatedImagesDir: "<%= yeoman.dist %>/client/images/generated"
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
          dest: ".tmp/generated/views/",
          expand: true,
          ext: ".html"
        }]
      }
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ["last 1 version"]
      },
      dist: {
        files: [{
          expand: true,
          cwd: ".tmp/styles/",
          src: "{,*/}*.css",
          dest: ".tmp/styles/"
        }]
      }
    },

    /********************************** MINIFICATION ***************************************************/

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them

    useminPrepare: {
      jade: "<%= yeoman.dist %>/server/views/index.jade",
      options: {
        dest: "<%= yeoman.dist %>",
        flow: {
          jade: {
            steps: {
              js: ["concat", "uglifyjs"],
              css: ["cssmin"]
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      jade: ["<%= yeoman.dist %>/server/views/{,**/}*.jade"],
      css: ["<%= yeoman.dist %>/client/styles/{,*/}*.css"],
      js: ["<%= yeoman.dist %>/client/scripts/{,*/}*.js"],
      options: {
        assetsDirs: ["<%= yeoman.dist %>"],
        patterns: {
          jade: require("usemin-patterns").jade,
          js: [
            [/(client\/modules\/route\/images\/.*?\.(?:gif|jpeg|jpg|png|webp))/gm, "Update the JS to reference our revved images"]
          ]
        }
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: "<%= yeoman.client %>",
          src: "modules/**/images/{,*/}*.{png,jpg,jpeg,gif}",
          dest: "<%= yeoman.dist %>/client"
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: "<%= yeoman.client %>/modules/**/images",
          src: ["{,*/}*.svg"],
          dest: "<%= yeoman.dist %>/client/images"
        }]
      }
    },

    // ngAnnotate tries to make the code safe for minification automatically by
    // using the Angular long form for dependency injection. It doesn"t work on
    // things like resolve or inject so those have to be done manually.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: ".tmp/concat/client/scripts",
          src: [
            "*.js",
            "!<%= yeoman.client %>/modules/main/scripts/services/config.js"
          ],
          dest: ".tmp/concat/client/scripts"
        }]
      }
    },

    copy: {
      server: {
        files: [{
          expand: true,
          src: ["server/**", "config/**", "locales/**", "server.js", "package.json"],
          dest: "<%= yeoman.dist %>"
        }]
      },
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: "<%= yeoman.client %>",
          dest: "<%= yeoman.dist %>/client",
          src: [
            "*.{ico,png,txt}",
            "sitemap.xml",
            "routingConfig.js",
            "modules/main/scripts/services/clientConfig.js"
          ]
        }, {
          expand: true,
          cwd: ".tmp/images",
          dest: "<%= yeoman.dist %>/client/images",
          src: ["generated/*"]
        }]
      },
      fonts: {
        files: [ //move bootstrap fonts
          {
            expand: true,
            flatten: true,
            src: [
              '<%= yeoman.client %>/bower_components/bootstrap/dist/fonts/*',
              '<%= yeoman.client %>/bower_components/font-awesome/fonts/*',
            ],
            dest: '<%= yeoman.dist %>/client/fonts'
          }
        ]
      }
    },

    rev: {
      dist: {
        files: {
          src: [
            "<%= yeoman.dist %>/client/scripts/{,*/}*.js",
            "<%= yeoman.dist %>/client/styles/{,*/}*.css",
            "<%= yeoman.dist %>/client/modules/**/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}",
            "<%= yeoman.dist %>/client/fonts/*"
          ]
        }
      }
    },

    /******************************** JS DOC **********************************************/

    jsdoc: {
      dist: {
        src: ["<%= yeoman.server %>/**/*.js", "<%= yeoman.config %>/**/*.js"],
        options: {
          destination: "<%= yeoman.dist %>/jsdoc"
        }
      }
    },


    /*************************** SERVERS *******************************************************/

    express: {
      options: {
        port: 3000,
        background: true,
        debug: true,
      },
      development: {
        options: {
          node_env: "development",
          script: "server.js",
        }
      },
      dist: {
        options: {
          node_env: "dist",
          script: "<%= yeoman.dist %>/server.js",
        }
      },
      test: {
        options: {
          node_env: "test"
        }
      }
    },

    "node-inspector": {
      dev: {}
    },

    /********************************** checkcode ***************************************************/

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: ".jshintrc",
        reporter: require("jshint-stylish"),
        reporterOutput: "jshint.xml",
        ignores: ["<%= yeoman.client %>/widgets/*.js"]
      },
      all: [
        "Gruntfile.js",
        "<%= yeoman.client %>/modules/**/*.js",
        "<%= yeoman.server %>/**/*.js",
        "<%= yeoman.config %>/**/*.js",
      ],
      ignore_warning: {
        options: {
          "-W092": true,
        },
      }
    },

    /********************************** TEST PART ***************************************************/

    mochaTest: {
      unit: {
        options: {
          reporter: "spec",
          require: "blanket",
          quiet: false
        },
        src: ["test/server/unit/**/test-*.js"]
      },
      integration: {
        options: {
          timeout: 5000,
          reporter: "spec",
          quiet: false,
          require: "blanket"
        },
        src: ["test/server/integration/**/test-races-search.js"]
      },
      "integration-coverage": {
        options: {
          reporter: "html-cov",
          // use the quiet flag to suppress the mocha console output
          quiet: true,
          // specify a destination file to capture the mocha
          // output (the quiet option does not suppress this)
          captureFile: "test/server/integration/coverage/integration-coverage.html"
        },
        src: ["test/server/integration/**/test-*.js"]
      },
      "unit-coverage": {
        options: {
          reporter: "html-cov",
          // use the quiet flag to suppress the mocha console output
          quiet: true,
          // specify a destination file to capture the mocha
          // output (the quiet option does not suppress this)
          captureFile: "test/server/unit/coverage/unit-coverage.html"
        },
        src: ["test/server/unit/**/test-*.js"]
      },
      "unit-travis-cov": {
        options: {
          reporter: "travis-cov"
        },
        src: ["test/server/unit/**/test-*.js"]
      },
      "integration-travis-cov": {
        options: {
          reporter: "travis-cov"
        },
        src: ["test/server/integration/**/test-*.js"]
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
        configFile: "test/client/spec/karma.conf.js",
        singleRun: true
      }
    },

    replace: {
      development: {
        options: {
          patterns: [{
            json: grunt.file.readJSON("./config/environments/development.json")
          }]
        },
        files: [{
          expand: true,
          flatten: true,
          src: ["./config/clientConfig.js"],
          dest: "<%= yeoman.client %>/modules/main/scripts/services/"
        }]
      },
      production: {
        options: {
          patterns: [{
            json: grunt.file.readJSON("./config/environments/production.json")
          }]
        },
        files: [{
          expand: true,
          flatten: true,
          src: ["./config/clientConfig.js"],
          dest: "<%= yeoman.client %>/modules/main/scripts/services/"
        }]
      },
      test: {
        options: {
          patterns: [{
            json: grunt.file.readJSON("./config/environments/test.json")
          }]
        },
        files: [{
          expand: true,
          flatten: true,
          src: ["./config/clientConfig.js"],
          dest: "<%= yeoman.client %>/modules/main/scripts/services/"
        }]
      }
    },


    /********************************** SCRIPTS PART ***************************************************/

    shell: {
      options: {
        stdout: true
      },
      seleniumInstall: {
        command: "node ./node_modules/protractor/bin/webdriver-manager update"
      },
      npmInstall: {
        command: "npm install"
      },
      bowerInstall: {
        command: "bower install"
      }
    },
    bgShell: {
      _defaults: {
        bg: true
      },
      startSelenium: {
        cmd: "node ./node_modules/protractor/bin/webdriver-manager start"
      },
      stopSelenium: {
        cmd: "curl -s -L http://localhost:4444/selenium-server/driver?cmd=shutDownSeleniumServer"
      }
    },
    mongo_drop: {
      test: {
        "uri": "mongodb://localhost:27017/nextrun_test"
      },
    },
  });



  /********************************** TASKS PART ***************************************************/

  grunt.registerTask("test-client", ["test-client:unit"]); //"test-client:e2e"
  grunt.registerTask("test-client:unit", ["karma:unit"]);
  grunt.registerTask("test-client:e2e", ["bgShell:stopSelenium", "mongo_drop:test", "bgShell:startSelenium", "express:test", "protractor:singleRun", "bgShell:stopSelenium"]);

  grunt.registerTask("test-server", ["test-server:unit"]); //"test-server:integration"
  grunt.registerTask("test-server:unit", ["mochaTest:unit", "mochaTest:unit-coverage", "mochaTest:unit-travis-cov"]);
  grunt.registerTask("test-server:integration", ["mochaTest:integration"]); //"mochaTest:integration-coverage", "mochaTest:integration-travis-cov"


  grunt.registerTask("install", ["update", "shell:seleniumInstall", "copy:move_css"]);

  grunt.registerTask("update", ["shell:npmInstall", "shell:bowerInstall"]);

  grunt.registerTask("test", ["test-server", "test-client"]);


  grunt.registerTask("generate-css", [
    "compass:dist"
  ]);


  grunt.registerTask("install", "install the backend and frontend dependencies", function() {
    var exec = require("child_process").exec;
    var cb = this.async();
    exec("npm install --production", {
      cwd: "./dist"
    }, function(err, stdout) {
      console.log(stdout);
      cb();
    });
  });

  grunt.registerTask("gettext", [
    "jade:compile",
    "nggettext_extract",
    "nggettext_compile"
  ]);

  grunt.registerTask("build", [
    "clean:dist",
    "bowerInstall",
    "copy:server",
    "gettext",
    "useminPrepare",
    "concurrent:dist",
    "replace:production",
    "autoprefixer",
    "concat",
    "copy:dist",
    "ngAnnotate",
    "cssmin",
    "uglify",
    "rev",
    "usemin",
    "copy:fonts",
    "jsdoc",
    "install"
  ]);

  grunt.registerTask("default", [
    "newer:jshint",
    "test",
    "build"
  ]);

  grunt.registerTask("serve", function(target) {
    if (target === "dist") {
      return grunt.task.run(["build", "express:dist"]);
    }

    grunt.task.run([
      "clean:server",
      "bowerInstall",
      "concurrent:server",
      "replace:development",
      "autoprefixer",
      "express:development",
      "node-inspector:dev",
      "watch"
    ]);

  });
};