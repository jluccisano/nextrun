angular.module('nextrunApp').factory('sharedService', function($rootScope) {
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
});