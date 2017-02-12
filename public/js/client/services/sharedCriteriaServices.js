angular.module('nextrunApp')
    .factory('mySharedService', ['$rootScope',
        function($rootScope) {

            'use strict';

            var sharedService = {};

            sharedService.fulltext = '';

            sharedService.prepForBroadcast = function(fulltext) {
                this.fulltext = fulltext;
                this.broadcastItem();
            };

            sharedService.broadcastItem = function() {
                $rootScope.$broadcast('handleBroadcast');
            };

            return sharedService;
        }
    ]);