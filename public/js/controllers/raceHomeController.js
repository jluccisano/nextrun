angular.module('nextrunApp').controller('RaceHomeCtrl', ['$scope', '$location', 'sharedMetaService',
	function($scope, $location, sharedMetaService) {
		'use strict';

		$scope.createNewRace = function() {
			$location.path('/races/create');
		}

		setTimeout(function() {
			sharedMetaService.prepForMetaBroadcast('Ajouter une manifestation', $location.path(), "Cr&eacute;ez votre manifestation, commencer maintenant !");
		}, 1000);

		$scope.ready();

	}
]);