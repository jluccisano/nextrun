"use strict";

angular.module("nextrunApp.commons").directive("nrFileSelect", function() {
	return {
		require: ["ngModel"],
		link: function($scope, el) {

			el.bind("change", function(e) {
				$scope.file = (e.srcElement || e.target).files[0];
				$scope.getFile($scope.route, $scope.file);
			});
		}
	};
});