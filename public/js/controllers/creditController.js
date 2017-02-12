angular.module('nextrunApp').controller('CreditCtrl', ['$scope', '$location', 'sharedMetaService',
	function($scope, $location, sharedMetaService) {
		'use strict';

		setTimeout(function() {
			sharedMetaService.prepForMetaBroadcast('Remerciements', $location.path(), "Liste des frameworks utilis&eacute;s");
		}, 1000);

		$scope.ready();

	}
]);