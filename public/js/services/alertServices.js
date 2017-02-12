angular.module('nextrunApp')
    .factory('Alert', ['$rootScope', '$timeout',
        function($rootScope, $timeout) {
            'use strict';
            var alertService = {};

            // create an array of alerts available globally
            $rootScope.alerts = [];

            alertService.add = function(type, msg, timeout) {
                $rootScope.alerts.push({
                    'type': type,
                    'msg': msg,
                    close: function() {
                        return alertService.closeAlert(this);
                    }
                });

                if (timeout) {
                    $timeout(function() {
                        alertService.closeAlert(this);
                    }, timeout);
                }
            };

            alertService.closeAlert = function(alert) {
                return this.closeAlertIdx($rootScope.alerts.indexOf(alert));
            };

            alertService.closeAlertIdx = function(index) {
                return $rootScope.alerts.splice(index, 1);
            };

            return alertService;

        }
    ]);