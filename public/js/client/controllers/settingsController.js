nextrunControllers.controller('SettingsCtrl', ['$scope','$location','$http', 'Auth', 'Alert',
	function($scope, $location, $http, Auth, Alert) {

		$scope.user = {};
		$scope.master = {};

	    Auth.getUserProfile(
	        function(response) {
				$scope.master = angular.copy(response.user);
		        $scope.reset();
	        },
	        function(error) {
	        	
	        }
	    );

	    $scope.updateProfile = function () {

		  	Auth.updateProfile({
				user: $scope.user
            },
            function(response) {
				Alert.add("success", "Les changements ont bien été pris en compte", 3000);
				$scope.master = angular.copy(response.user);
				$scope.reset();

            },
            function(error) {
				Alert.add("danger", error.message, 3000);
            });
		};

		$scope.deleteAccount = function () {

		  	Auth.deleteAccount($scope.user._id,
	            function(response) {
					Alert.add("success", "Votre compte a bien été supprimé", 3000);
					$location.path("/");
	            },
	            function(error) {
					Alert.add("danger", error.message, 3000);
	        });
		};		

		$scope.isUnchanged = function(user) {
    		return angular.equals(user, $scope.master);
  		};

  		$scope.reset = function() {
    		$scope.user = angular.copy($scope.master);
    	};
	}
]);