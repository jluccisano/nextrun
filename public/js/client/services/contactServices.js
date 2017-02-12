angular.module('nextrunApp')
.factory('ContactServices', function($http){

    return {
        addContact: function(contact) {
            $http.post('/contacts').success(function(){
                success();
            }).error(error);
        }
    };
});