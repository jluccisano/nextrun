"use strict";

angular.module("nextrunApp").controller("CreditController",
	function(
		$scope, 
		$location, 
		$translate, 
		$filter,
		MetaService) {

		MetaService.ready($filter("translate")("title.credits"), $location.path(), $filter("translate")("title.credits.description"));

	});