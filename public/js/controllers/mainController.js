angular.module('nextrunApp').controller('MainCtrl', ['$scope', '$location', '$rootScope', 'Auth', 'Alert', 'sharedMetaService',
	function($scope, $location, $rootScope, Auth, Alert, sharedMetaService) {
		'use strict';

		$scope.$on('handleBroadcastMeta', function() {
			$scope.pageTitle = sharedMetaService.pageTitle;
			$scope.ogTitle = sharedMetaService.pageTitle;
			$scope.ogUrl = sharedMetaService.url;
			$scope.ogDescription = sharedMetaService.description;
			$scope.$apply();
		});

		$scope.isLoggedIn = function() {
			return Auth.isLoggedIn();
		};

		$rootScope.closeAlert = function() {
			Alert.closeAlert();
		};

	}
]);