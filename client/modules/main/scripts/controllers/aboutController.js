"use strict";

angular.module("nextrunApp").controller("AboutController",
	function(
		$location,
		MetaService) {

		MetaService.ready("title.about", $location.path(), "message.about.description");
	});