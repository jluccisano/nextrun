"use strict";

angular.module("nextrunApp.race").controller("CropImageModalController", function(
	$scope,
	$modalInstance,
	image) {

	$scope.croppedImage = "";

	$scope.tmpImage = {};

	$scope.init = function() {
		$scope.myImage = image;
		angular.copy($scope.myImage, $scope.tmpImage);
	};

	$scope.submit = function() {
		$modalInstance.close($scope.croppedImage);
	};

	$scope.cancel = function() {
		angular.copy($scope.tmpImage, $scope.myImage);
		$modalInstance.dismiss("cancel");
	};

	$scope.init();

});