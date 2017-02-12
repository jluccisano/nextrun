nextrunControllers.controller('MainCtrl', ['$scope','$location','$templateCache','$timeout',
	function($scope, $location,$templateCache,$timeout) {

		$scope.menuUrl = 'partials/menu';  
		/*$scope.menuUrl = function() {
			return "partials/menu";
		};*/

		$scope.login = function() {
			$location.path('/login');
		};

		$scope.refresh = function() {
	        $templateCache.remove('partials/menu');
	        $scope.menuUrl = '';
	        $timeout(function() {
	            $scope.menuUrl = 'partials/menu';
	        },1000);
    	};
		
	}
]);