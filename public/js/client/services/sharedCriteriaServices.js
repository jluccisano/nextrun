angular.module('nextrunApp')
    .factory('mySharedService', ['$rootScope',
        function($rootScope) {

            'use strict';

            var sharedService = {};

            sharedService.fulltext = '';
            sharedService.criteria = undefined;

            sharedService.prepForFullTextBroadcast = function(fulltext) {
                this.fulltext = fulltext;
                this.broadcastFullTextItem();
            };

            sharedService.prepForCriteriaBroadcast = function(criteria) {
                this.criteria = criteria;
                this.broadcastCriteriaItem();
            };

            sharedService.broadcastFullTextItem = function() {
                $rootScope.$broadcast('handleFullTextBroadcast');
            };

            sharedService.broadcastCriteriaItem = function() {
                $rootScope.$broadcast('handleCriteriaBroadcast');
            };

            return sharedService;
        }
    ]);