angular.module('nextrunApp')
    .factory('mySharedService', ['$rootScope',
        function($rootScope) {

            'use strict';

            var sharedService = {};

            sharedService.fulltext = '';

            sharedService.prepForBroadcast = function(fulltext, region, currentTypesSelected) {
                this.fulltext = fulltext;
                this.region = region;
                this.currentTypesSelected = currentTypesSelected;
                this.broadcastItem();
            };

            sharedService.broadcastItem = function() {
                $rootScope.$broadcast('handleBroadcast');
            };

            return sharedService;
        }
    ]);