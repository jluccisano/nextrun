"use strict";

angular.module("nextrunApp").controller("AboutController",
	function(
		$location,
		MetaService,
		gettextCatalog) {

		MetaService.ready(gettextCatalog.getString("A propos"), $location.path(), gettextCatalog.getString("A propos"));
	});