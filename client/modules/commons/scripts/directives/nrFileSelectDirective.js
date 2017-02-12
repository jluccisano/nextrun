"use strict";

angular.module("nextrunApp.commons").directive("nrImageSelect", function($modal, RaceService, notificationService, gettextCatalog) {
	return {
		link: function($scope, $element) {

			//var inputFile = $element.parent().find('input[type="file"]');

			var inputFile = angular.element(document.querySelector("#fileInput"));

			$element.bind("click", function() {
				//inputFile.trigger("click");
				inputFile.click();
			});

			inputFile.bind("change", function(e) {
				//$scope.file = (e.srcElement || e.target).files[0];
				//$scope.getFile($scope.file);
				handleFileSelect(e);
			});

			var handleFileSelect = function(evt) {
				var file = evt.currentTarget.files[0];
				var reader = new FileReader();
				reader.onload = function(evt) {
					$scope.$apply(function($scope) {
						//$scope.myImage = evt.target.result;
						$scope.modalInstance = $modal.open({
							templateUrl: "partials/race/templates/cropImageModal",
							controller: "CropImageModalController",
							backdrop: false,
							resolve: {
								image: function() {
									return evt.target.result;
								}
							}
						});

						$scope.modalInstance.result.then(function(croppedImage) {
							$scope.image = croppedImage;

							var image = {
								base64: croppedImage
							};

							RaceService.uploadImage($scope.race._id, image).then(function(){
								notificationService.success(gettextCatalog.getString("Votre photo a bien été mise à jour"));
							});
						});
					});
				};
				reader.readAsDataURL(file);
			};
		}
	};
});

angular.module("nextrunApp.commons").directive("nrImportGpx", function($modal, RaceService, notificationService, gettextCatalog) {
	return {
		link: function($scope, $element) {

			//var inputFile = $element.parent().find('input[type="file"]');

			var inputFile = angular.element(document.querySelector("#fileInput"));

			$element.bind("click", function() {
				//inputFile.trigger("click");
				inputFile.click();
			});

			inputFile.bind("change", function(e) {
				//$scope.file = (e.srcElement || e.target).files[0];
				//$scope.getFile($scope.file);
				handleFileSelect(e);
			});

			var handleFileSelect = function(evt) {
				var file = evt.currentTarget.files[0];
				var reader = new FileReader();
				reader.onload = function(evt) {
					$scope.$apply(function($scope) {
						//$scope.myImage = evt.target.result;
						$scope.getFile(evt.target.result;);
						
					});
				};
				reader.readAsDataURL(file);
			};
		}
	};
});

angular.module("nextrunApp.commons").directive("nrFileSelect", function() {
	return {
		require: "ngModel",
		link: function($scope, $element, attrs, controller) {

			$element.bind("change", function(e) {
				handleFileSelect(e);
			});

			var handleFileSelect = function(evt) {
				var file = evt.currentTarget.files[0];
				var reader = new FileReader();
				reader.onload = function(evt) {
					$scope.$apply(function() {
						controller.$setViewValue(evt.target.result);
					});
				};
				reader.readAsDataURL(file);
			};
		}
	};
});