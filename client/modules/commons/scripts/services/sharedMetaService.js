"use strict";

angular.module("nextrunApp.commons").factory("SharedMetaService",
    function($rootScope, gettextCatalog) {

        var sharedMetaService = {};

        var base64ToBlob = function(base64, type) {
            var binary = atob(base64);
            var len = binary.length;
            var buffer = new ArrayBuffer(len);
            var view = new Uint8Array(buffer);
            for (var i = 0; i < len; i++) {
                view[i] = binary.charCodeAt(i);
            }
            var blob = new Blob([view], {
                type: "text/xml"
            });
            return blob;
        };

        sharedMetaService.pageTitle = "Nextrun";
        sharedMetaService.url = "http://www.nextrun.fr";
        sharedMetaService.description = "Toutes les épreuves d'endurances regroupées sur un même site";
        sharedMetaService.image = "http://www.nextrun.fr/client/modules/main/images/logo_officiel.png";

        sharedMetaService.prepForMetaBroadcast = function(title, url, description, image) {
            this.pageTitle = gettextCatalog.getString(title);
            this.url = url;
            this.description = gettextCatalog.getString(description);
            if (image) {
                var matches = image.match(/^data:([A-Za-z-+.\/]+);base64,(.+)$/);
                if (matches.length === 3) {
                    var blobImage = base64ToBlob(matches[2], matches[1]);
                    this.image = URL.createObjectURL(blobImage);
                }
            }
            this.broadcastMeta();
        };



        sharedMetaService.broadcastMeta = function() {
            $rootScope.$broadcast("handleBroadcastMeta");
        };

        return sharedMetaService;
    });