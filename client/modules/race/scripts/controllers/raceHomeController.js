"use strict";

angular.module("nextrunApp.race").controller("RaceHomeController",
	function(
		$scope,
		$location,
		$translate,
		$translatePartialLoader,
		$filter,
		MetaService) {

		$scope.createNewRace = function() {
			$location.path("/races/create");
		};

		MetaService.ready($filter("translate")("title.addRace"), $location.path(), $filter("translate")("message.addRace.description"));
	});