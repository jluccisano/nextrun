nextrunControllers.controller('HeaderCtrl', ['$scope', '$location', '$rootScope', 'Auth',
	function($scope, $location, $rootScope, Auth) {
		'use strict';
		$scope.user = Auth.user;
		$scope.userRoles = Auth.userRoles;
		$scope.accessLevels = Auth.accessLevels;

		$scope.logout = function() {
			Auth.logout(function() {
				$location.path('/login');
			}, function() {
				$rootScope.error = "Failed to logout";
			});
		};

		$scope.login = function() {
			$location.path('/login');
		};
	}
]);