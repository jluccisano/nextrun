nextrunControllers.controller('MyRacesCtrl', ['$scope','$location','$timeout',
	function($scope, $location, $timeout) {

		$scope.addNewRace = function() {
			$location.path('/races/create');
		};

		
	}
]);