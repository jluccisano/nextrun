nextrunControllers.controller('HomeCtrl', ['$scope','$http', '$location', 'ContactServices','Alert',
	function($scope, $http, $location, ContactServices, Alert) {

		 $scope.types = [
		    {name:'Athlète'},
		    {name:'Organisteur'},
		    {name:'Autre', shade:'dark'}
		  ];

		$scope.submit = function() {

			ContactServices.addContact({
				email: $scope.email,
				type: $scope.type
            },
            function(res) {
				Alert.add("success", "Félicitations", 3000);
		
            },
            function(error) {
				 Alert.add("danger", error.message, 3000);
            });
		};
	
}]);