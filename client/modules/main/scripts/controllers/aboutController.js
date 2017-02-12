"use strict";

angular.module("nextrunApp").controller("AboutController",
	function(
		$location,
		MetaService) {

		MetaService.ready("A propos");
	});