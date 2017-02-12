nextrunControllers.controller('SettingsCtrl', ['$scope','$location','$http',
	function($scope, $location, $http) {

		$scope.user = {};

		$http({
	            method: 'GET',
	            url: '/users/settings'
	        }).
	        then(function (response) {

	        	$scope.user = response.data.user;

	        }
	    );

	    $scope.changeProfile = function () {

		  	Auth.changeProfile({
				user: $scope.user
            },
            function(res) {
				Alert.add("success", "Les changements ont bien été pris en compte", 3000);
				$location.path('/');
				$scope.user = res;

            },
            function(error) {
            	 _.each(error.message, function(message){
					  Alert.add("danger", message, 3000);
				});
            });
		};	

	}
]);