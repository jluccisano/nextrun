var nextrunControllers = angular.module('nextrunControllers', []);


nextrunControllers.controller('HomeCtrl', ['$scope','$http',
	function($scope, $http) {
	
}]);

nextrunControllers.controller('LoginCtrl', ['$scope','$http', '$location',
	function($scope, $http, $location) {

		$scope.signup = function() {
			$location.path('/signup');
		};

		$scope.login = function() {
			$http({
				method: 'POST',
				url: "/users/session",
				data: $scope.user
			}).
			then(function (response) {

				console.log(response);

				if (response.data.success == 'OK') {
						$location.path('/users/races/home');
				} else {

					jQuery('#invalidEmailOrPassword').addClass('in').removeClass('hide');
					var error = response.data.error;
					if(error) {
						jQuery('#invalidEmailOrPassword').text(error);
					}
				}

			});
		};
		 
	
}]);

nextrunControllers.controller('FooterCtrl', ['$scope','$location','$timeout',
	function($scope, $location, $timeout) {

		$scope.hideFooter = false;

		$scope.$on( '$routeChangeSuccess', function ( event, current, previous ) {
			if ( $location.path() === '/' ) {

				$timeout(function() {
					$scope.hideFooter = true;
				}, 1000);

			} else {
				$scope.hideFooter = false;
			}
		});
	}
]);



