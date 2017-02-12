"use strict";

angular.module("nextrunApp.commons").factory("MetaService",
    function(
        $rootScope,
        SharedMetaService) {

        return {
            ready: function(title, url, description) {

                setTimeout(function() {
                    SharedMetaService.prepForMetaBroadcast(title, url, description);
                }, 1000);

                $rootScope.status = "ready";
                if (!$rootScope.$$phase) {
                    $rootScope.$apply();
                }
            },
            loading: function() {
                $rootScope.status = "loading";
                if (!$rootScope.$$phase) {
                    $rootScope.$apply();
                }
            }
        };

    });