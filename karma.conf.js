// Karma configuration
// Generated on Thu Mar 13 2014 09:44:03 GMT+0100 (Paris, Madrid)

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            "http://maps.googleapis.com/maps/api/js?sensor=false&language=en",
            'client_components/jquery/dist/jquery.js',
            'client_components/angular/angular.js',
            'client_components/angular-mocks/angular-mocks.js',
            'client_components/i18next/i18next.js',
            'client_components/underscore/underscore.js',
            'client_components/angular-cookies/angular-cookies.js',
            'client_components/angular-route/angular-route.js',
            'client_components/angular-animate/angular-animate.js',
            'client_components/angular-sanitize/angular-sanitize.js',
            'client_components/angular-bootstrap/ui-bootstrap-tpls.js',
            'client_components/raphael/raphael.js',
            'client_components/angular-google-maps/dist/angular-google-maps.js',
            'client_components/highcharts-ng/dist/highcharts-ng.js',
            'client_components/angular-bootstrap-datetimepicker/src/js/datetimepicker.js',
            'client_components/angular-date-time-input/src/dateTimeInput.js',
            'client_components/angular-gm-googlemaps/src/module.js',

            'public/js/libs/enum-0.2.5.js',
            'public/js/libs/textAngular.js',

            'public/js/client/**/*.js',

            'test/**/*Spec.js'
        ],


        // list of files to exclude
        exclude: ['public/js/client/widgets/map-france.js', 'public/js/client/pages/home.js'],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            '**/public/js/client/**/*.js': ['coverage']
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['dots', 'progress', 'coverage', 'junit'],

        // optionally, configure the reporter
        coverageReporter: {
            type: 'html',
            dir: 'coverage/'
        },

        junitReporter: {
            outputFile: 'test-results.xml',
            suite: ''
        },

        plugins: [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-jasmine'
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
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true
    });
};