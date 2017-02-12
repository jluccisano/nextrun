"use strict";

angular.module("nextrunApp").controller("ContactController",
	function(
		$scope, 
		$location, 
		$translate, 
		$filter,
		MetaService) {

		MetaService.ready($filter("translate")("title.contacts"), $location.path(), $filter("translate")("message.contacts.description"));
	});