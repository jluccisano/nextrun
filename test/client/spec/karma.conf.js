// Karma configuration
// Generated on Thu Mar 13 2014 09:44:03 GMT+0100 (Paris, Madrid)

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: "../../../",


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ["jasmine"],


        // list of files / patterns to load in the browser
        files: [
            "http://maps.googleapis.com/maps/api/js?sensor=false&language=en",

            "client/bower_components/jquery/dist/jquery.js",
            "client/bower_components/angular/angular.js",
            "client/bower_components/angular-route/angular-route.js",
            "client/bower_components/angular-cookies/angular-cookies.js",
            "client/bower_components/angular-animate/angular-animate.js",
            "client/bower_components/angular-bootstrap/ui-bootstrap-tpls.js",
            "client/bower_components/moment/moment.js",
            "client/bower_components/angular-sanitize/angular-sanitize.js",
            "client/bower_components/lodash/dist/lodash.compat.js",
            "client/bower_components/angular-google-maps/dist/angular-google-maps.js",
            "client/bower_components/angular-gettext/dist/angular-gettext.js",
            "client/bower_components/AngularGM/angular-gm.js",
            "client/bower_components/bootstrap/dist/js/bootstrap.js",
            "client/bower_components/bootstrap-multiselect/js/bootstrap-multiselect.js",
            "client/bower_components/highcharts-release/highcharts.js",
            "client/bower_components/highcharts-release/highcharts-more.js",
            "client/bower_components/highcharts-release/modules/exporting.js",
            "client/bower_components/highcharts-ng/dist/highcharts-ng.js",
            "client/bower_components/underscore/underscore.js",
            "client/bower_components/x2js/xml2json.min.js",
            "client/bower_components/angular-strap/dist/angular-strap.js",
            "client/bower_components/angular-strap/dist/angular-strap.tpl.js",
            "client/bower_components/bootstrap-daterangepicker/daterangepicker.js",

            "client/bower_components/angular-mocks/angular-mocks.js",
            
            "client/lib/enum-0.2.5.js",
            "client/lib/textAngular.js",

            "client/routingConfig.js",

            "client/modules/commons/scripts/commons.js",
            "client/modules/commons/scripts/**/*.js",

            "client/modules/main/scripts/main.js",
            "client/modules/main/scripts/**/*.js",

            "client/modules/auth/scripts/auth.js",
            "client/modules/auth/scripts/**/*.js",

            "client/modules/home/scripts/home.js",
            "client/modules/home/scripts/**/*.js",

            "client/modules/race/scripts/race.js",
            "client/modules/race/scripts/**/*.js",

            "client/modules/route/scripts/route.js",        
            "client/modules/route/scripts/**/*.js",

            "test/client/spec/mock/mockModule.js",
            "test/client/spec/mock/mock*.js",

            "test/client/spec/modules/auth/**/*Spec.js",
            "test/client/spec/modules/home/**/*Spec.js",
            "test/client/spec/modules/main/**/*Spec.js",
            "test/client/spec/modules/race/**/*Spec.js",
            "test/client/spec/modules/commons/**/*Spec.js",
            "test/client/spec/modules/route/**/*Spec.js",

        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            "client/modules/**/*.js": ["coverage"]
        },


        // test results reporter to use
        // possible values: "dots", "progress"
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ["coverage", "progress", "junit", "spec"],

        coverageReporter: {
            type: "html",
            dir: "./test/client/spec/coverage/"
        },

        junitReporter: {
            outputFile: "./test/client/spec/test-reports-junit.xml",
            suite: "unit"
        },

        plugins: [
            "karma-junit-reporter",
            "karma-phantomjs-launcher",
            "karma-chrome-launcher",
            "karma-jasmine",
            "karma-coverage",
            "karma-spec-reporter",
        ],

        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_DEBUG,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher*
        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ["PhantomJS"],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true
    });
};