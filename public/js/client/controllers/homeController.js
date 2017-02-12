nextrunControllers.controller('HomeCtrl', ['$scope', '$http', '$location', 'ContactServices', 'Alert',
	function($scope, $http, $location, ContactServices, Alert) {
		'use strict';
		$scope.contact = {};

		$scope.types = [{
			name: 'Athlète'
		}, {
			name: 'Organisteur'
		}, {
			name: 'Autre',
			shade: 'dark'
		}];

		$scope.submit = function(contact) {

			ContactServices.addContact(contact,
				function(res) {
					Alert.add("success", "Merci à bientôt", 3000);
				},
				function(error) {
					_.each(error.message, function(message) {
						Alert.add("danger", message, 3000);
					});
				});
		};
	}
]);