angular.module('nextrunApp')
.factory('ContactService', function($http){

    return {
        addContact: function(contact) {
            $http.post('/contacts').success(function(){
                success();
            }).error(error);
        }
    };
});