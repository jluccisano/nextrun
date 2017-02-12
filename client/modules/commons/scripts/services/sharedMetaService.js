"use strict";

angular.module("nextrunApp.commons").factory("SharedMetaService",
    function($rootScope, gettextCatalog) {

        var sharedMetaService = {};

        sharedMetaService.pageTitle = "Nextrun";
        sharedMetaService.url = "http://www.nextrun.fr";
        sharedMetaService.description = "";

        sharedMetaService.prepForMetaBroadcast = function(title, url, description) {
            this.pageTitle = gettextCatalog.getString(title);
            this.url += url;
            this.description = gettextCatalog.getString(description);
            this.broadcastMeta();
        };

        sharedMetaService.broadcastMeta = function() {
            $rootScope.$broadcast("handleBroadcastMeta");
        };

        return sharedMetaService;
    });