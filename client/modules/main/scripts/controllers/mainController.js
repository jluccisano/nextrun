"use strict";

angular.module("nextrunApp").controller("MainController",
	function(
		$scope,
		AuthService,
		SharedMetaService) {

		$scope.$on("handleBroadcastMeta", function() {
			$scope.pageTitle = SharedMetaService.pageTitle;
			$scope.ogTitle = SharedMetaService.pageTitle;
			$scope.ogUrl = SharedMetaService.url;
			$scope.ogDescription = SharedMetaService.description;
			$scope.ogImage = SharedMetaService.image;
			$scope.$apply();
		});

		$scope.isLoggedIn = function() {
			return AuthService.isLoggedIn();
		};
	});