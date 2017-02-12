angular.module('nextrunApp').controller('LoginCtrl', ['$scope', '$http', '$location', '$rootScope', 'Auth', 'Alert', '$modal',
	function($scope, $http, $location, $rootScope, Auth, Alert, $modal) {
		'use strict';
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
					console.log("error message:" + error);
					_.each(error.message, function(message) {
						Alert.add("danger", message, 3000);
					});
				});
		};

		$scope.open = function() {

			var modalInstance = $modal.open({
				templateUrl: 'partials/forgotpassword',
				controller: 'ModalInstanceCtrl'
			});
		};
	}
]);

angular.module('nextrunApp').controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'Auth', 'Alert', '$location',
	function($scope, $modalInstance, Auth, Alert, $location) {

		$scope.user = {};

		$scope.submit = function() {

			Auth.forgotpassword({
					user: $scope.user
				},
				function(res) {
					Alert.add("success", "Un email vient de vous être envoyé", 3000);
					$modalInstance.close();
					$location.path('/login');
				},
				function(error) {
					_.each(error.message, function(message) {
						Alert.add("danger", message, 3000);
					});
					$modalInstance.close();
				});
		};

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};
	}
]);