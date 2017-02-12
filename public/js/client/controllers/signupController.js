nextrunControllers.controller('SignupCtrl', ['$scope','$http', '$location', '$rootScope','Auth', 'Alert',
	function($scope, $http, $location, $rootScope, Auth, Alert) {

		$scope.user = {};

		$scope.submit = function () {

			Auth.register({
				user: $scope.user
			},
			function(res) {
				Alert.add("success", "Félicitation! votre inscription a été validé", 3000);
				$location.path('/');
			},
			function(error) {
				_.each(error.message, function(message){
					Alert.add("danger", message, 3000);
				});
			});
		};	
}]);