"use strict";

angular.module("nextrunApp").controller("AboutController",
	function(
		$scope,
		$location,
		$translate,
		$filter,
		MetaService) {

		MetaService.ready($filter("translate")("title.about"), $location.path(), $filter("translate")("message.about.description"));
	});