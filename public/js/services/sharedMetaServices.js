angular.module('nextrunApp')
    .factory('sharedMetaService', ['$rootScope',
        function($rootScope) {

            'use strict';

            var sharedMetaService = {};

            sharedMetaService.pageTitle = 'Nextrun';
            sharedMetaService.url = 'http://www.nextrun.fr';
            sharedMetaService.description = '';

            sharedMetaService.prepForMetaBroadcast = function(title, url, description) {
                this.pageTitle = title;
                this.url += url;
                this.description = description;
                this.broadcastMeta();
            };

            sharedMetaService.broadcastMeta = function() {
                $rootScope.$broadcast('handleBroadcastMeta');
            };

            return sharedMetaService;
        }
    ]);