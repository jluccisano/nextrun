"use strict";

angular.module("nextrunApp").controller("MainController",
	function(
		$scope,
		AuthService,
		SharedMetaService) {

		$scope.meta = {};

		$scope.$on("handleBroadcastMeta", function() {
			
			$scope.meta.ogTitle = SharedMetaService.pageTitle;
			$scope.meta.pageTitle = SharedMetaService.pageTitle;
			$scope.meta.ogUrl = SharedMetaService.url;
			$scope.meta.ogDescription = SharedMetaService.description;
			$scope.meta.ogImage = SharedMetaService.image;
		});

		$scope.isLoggedIn = function() {
			return AuthService.isLoggedIn();
		};
	});