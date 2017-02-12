angular.module('nextrunApp')
.factory('RaceServices', function($http){

    return {
        create: function(data, success, error) {
            $http.post('/races',data).success(function(){
                success();
            }).error(error);
        },
        find: function(userId, page, success, error) {
            $http.get('/users/'+userId+'/races/page/'+page).success(function(races){
                success(races);
            }).error(error);
        },
        update: function(id, data , success, error) {
            $http.put('/races/'+id,data).success(function(){
                success();
            }).error(error);
        },
        delete: function(id, success, error) {
            $http.delete('/races/'+id).success(function(){
                success();
            }).error(error);
        }
    };
});