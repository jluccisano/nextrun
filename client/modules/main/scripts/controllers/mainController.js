"use strict";

angular.module("nextrunApp").controller("MainController",
	function(
		$scope,
		$translate,
		AuthService,
		AlertService,
		SharedMetaService) {

		$scope.$on("handleBroadcastMeta", function() {
			$scope.pageTitle = SharedMetaService.pageTitle;
			$scope.ogTitle = SharedMetaService.pageTitle;
			$scope.ogUrl = SharedMetaService.url;
			$scope.ogDescription = SharedMetaService.description;
			$scope.$apply();
		});

		$scope.isLoggedIn = function() {
			return AuthService.isLoggedIn();
		};

		$scope.closeAlert = function() {
			AlertService.closeAlert();
		};

	});