nextrunControllers.controller('HomeCtrl', ['$scope','$http', '$location', 'ContactServices','Alert',
	function($scope, $http, $location, ContactServices, Alert) {

		$scope.contact = {};

		$scope.types = [
			{name:'Athlète'},
			{name:'Organisteur'},
			{name:'Autre', shade:'dark'}
		];

		$scope.submit = function(contact) {

			ContactServices.addContact(contact,
				function(res) {
					Alert.add("success", "Merci à bientôt", 3000);
				},
				function(error) {
				Alert.add("danger", error.message[0], 3000);
			});
		};
}]);