"use strict";

angular.module("nextrunApp").controller("AboutController",
	function(
		$location,
		MetaService) {

		MetaService.ready("A propos", "Plus d'informations à propos de Nextrun");
	});