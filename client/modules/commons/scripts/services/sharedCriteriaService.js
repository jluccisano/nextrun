"use strict";

angular.module("nextrunApp.commons").factory("SharedCriteriaService",
    function($rootScope) {

        var sharedService = {};
        sharedService.criteria = {};

        sharedService.prepForCriteriaBroadcast = function(criteria) {
            this.criteria = criteria;
            this.broadcastCriteriaItem();
        };

        sharedService.broadcastCriteriaItem = function() {
            $rootScope.$broadcast("handleCriteriaBroadcast", this.criteria);
        };

        return sharedService;
    });