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