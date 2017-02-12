nextrunControllers.controller('MainCtrl', ['$scope','$location', '$rootScope','Auth','Alert',
	function($scope, $location, $rootScope, Auth, Alert) {

		$scope.isLoggedIn = function() {
			return Auth.isLoggedIn();
		};

		$rootScope.closeAlert = function() {
			Alert.closeAlert();
		};
		
	}
]);