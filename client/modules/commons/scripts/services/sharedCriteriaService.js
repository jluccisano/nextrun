"use strict";

angular.module("nextrunApp.commons").factory("SharedCriteriaService",
    function($rootScope) {

        var sharedService = {};
        sharedService.criteria = {};
        sharedService.type = {};

        sharedService.prepForCriteriaBroadcast = function(criteria, type) {
            this.criteria = criteria;
            this.type = type;
            this.broadcastCriteriaItem();
        };

        sharedService.broadcastCriteriaItem = function() {
            $rootScope.$broadcast("handleCriteriaBroadcast", this.criteria, this.type);
        };

        return sharedService;
    });