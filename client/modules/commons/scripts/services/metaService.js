"use strict";

angular.module("nextrunApp.commons").factory("MetaService",
    function(
        $rootScope,
        $state,
        SharedMetaService) {

        return {
            ready: function(title, description, image) {

                setTimeout(function() {

                    if(!description) {
                        description = title;
                    }
                    
                    SharedMetaService.prepForMetaBroadcast(title, $state.current.url , description, image);
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