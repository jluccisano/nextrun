angular.module('nextrunApp').controller('AboutCtrl', ['$scope', '$location', 'sharedMetaService',
	function($scope, $location, sharedMetaService) {
		'use strict';


		setTimeout(function() {
			sharedMetaService.prepForMetaBroadcast('A propos', $location.path(), "Suivez l&apos;&eacute;volution des diff&eacute;rentes fonctionnalit&eacute;s");
		}, 1000);

		$scope.ready();

	}
]);