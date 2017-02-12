nextrunControllers.controller('SettingsCtrl', ['$scope','$location','$http',
	function($scope, $location, $http) {

		$scope.user = null;

		$http({
	            method: 'GET',
	            url: '/users/settings'
	        }).
	        then(function (response) {

	        	$scope.user = response.data.user;

	        }
	    );

	}
]);