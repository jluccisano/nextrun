angular.module('nextrunApp').controller('ContactCtrl', ['$scope', '$location', 'sharedMetaService',
	function($scope, $location, sharedMetaService) {
		'use strict';

		setTimeout(function() {
			sharedMetaService.prepForMetaBroadcast('Contacts', $location.path(), "Contactez-nous");
		}, 1000);

		$scope.ready();

	}
]);