nextrunControllers.controller('LoginCtrl', ['$scope','$http', '$location', '$rootScope','Auth','Alert','$modal',
	function($scope, $http, $location, $rootScope, Auth, Alert, $modal) {

		$scope.user = {};

		$scope.signup = function() {
			$location.path('/signup');
		};

		$scope.submit = function() {

			Auth.login({
				email: $scope.user.email,
				password: $scope.user.password
            },
            function(res) {
				$location.path('/myraces');
		
            },
            function(error) {
				 Alert.add("danger", error.message, 3000);
            });
		};

		$scope.open = function () {

		    var modalInstance = $modal.open({
			      templateUrl: 'partials/forgotpassword',
			      controller: 'ModalInstanceCtrl'
			    });
  		};

		

}]);

nextrunControllers.controller('ModalInstanceCtrl', ['$scope','$modalInstance', 'Auth', 'Alert','$location',
	function($scope, $modalInstance, Auth, Alert, $location) {

		  $scope.user = {};

		  $scope.submit = function () {

		  	Auth.forgotpassword({
				user: $scope.user
            },
            function(res) {
            	Alert.add("success", "Un email vient de vous être envoyé", 3000);
            	$modalInstance.close();
				$location.path('/login');

            },
            function(error) {
            	Alert.add("danger", error.message, 3000);
            	$modalInstance.close();
            });

		    
		  };

		  $scope.cancel = function () {
		    $modalInstance.dismiss('cancel');
		  };
  	}
]);