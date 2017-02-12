// Karma configuration
// Generated on Thu Mar 13 2014 09:44:03 GMT+0100 (Paris, Madrid)

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '../',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            "http://maps.googleapis.com/maps/api/js?sensor=false&language=en",
            'bower_components/jquery/dist/jquery.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/i18next/i18next.js',
            'bower_components/underscore/underscore.js',
            'bower_components/angular-cookies/angular-cookies.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/angular-animate/angular-animate.js',
            'bower_components/angular-sanitize/angular-sanitize.js',
            'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
            'bower_components/raphael/raphael.js',
            'bower_components/angular-google-maps/dist/angular-google-maps.js',
            'bower_components/highcharts-ng/dist/highcharts-ng.js',
            'bower_components/angular-bootstrap-datetimepicker/src/js/datetimepicker.js',
            'bower_components/angular-date-time-input/src/dateTimeInput.js',
            'bower_components/angular-gm-googlemaps/src/module.js',
            'bower_components/AngularGM/angular-gm.js',
            'public/lib/enum-0.2.5.js',
            'public/lib/textAngular.js',

            'public/js/**/*.js',

            'test/client/unit/**/*Spec.js'
        ],


        // list of files to exclude
        exclude: ['public/js/pages/home.js'],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            '**/public/js/**/*.js': ['coverage']
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['coverage', 'progress', 'junit', 'spec'],

        coverageReporter: {
            type: 'html',
            dir: './test/coverage/'
        },

        junitReporter: {
            outputFile: './test/test-reports-junit.xml',
            suite: 'unit'
        },

        plugins: [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-jasmine',
            'karma-coverage',
            'karma-phantomjs-launcher',
            'karma-spec-reporter',
        ],

        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_DEBUG,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


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
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true
    });
};