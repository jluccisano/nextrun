angular.module('nextrunApp').controller('SettingsCtrl', ['$scope', '$location', '$http', 'Auth', 'Alert',
	function($scope, $location, $http, Auth, Alert) {
		'use strict';
		$scope.user = {};
		$scope.master = {};

		Auth.getUserProfile(
			function(response) {
				$scope.master = angular.copy(response.user);
				$scope.reset();
			},
			function(error) {}
		);

		$scope.updateProfile = function() {

			Auth.updateProfile($scope.user._id, {
					user: $scope.user
				},
				function(response) {
					Alert.add("success", "Les changements ont bien été pris en compte", 3000);
					$scope.master = angular.copy(response.user);
					$scope.reset();
				},
				function(error) {
					_.each(error.message, function(message) {
						Alert.add("danger", message, 3000);
					});
				});
		};

		$scope.updatePassword = function() {

			Auth.updatePassword($scope.user._id, {
					actual: $scope.actualPassword,
					new: $scope.newPassword
				},
				function(response) {
					Alert.add("success", "Les changements ont bien été pris en compte", 3000);
					$scope.master = angular.copy(response.user);
					$scope.reset();
				},
				function(error) {
					_.each(error.message, function(message) {
						Alert.add("danger", message, 3000);
					});
				});
		};

		$scope.deleteAccount = function() {

			Auth.deleteAccount($scope.user._id,
				function(response) {
					Alert.add("success", "Votre compte a bien été supprimé", 3000);
					$location.path("/");
				},
				function(error) {
					_.each(error.message, function(message) {
						Alert.add("danger", message, 3000);
					});
				});
		};

		$scope.isUnchanged = function(user) {
			return angular.equals(user, $scope.master);
		};

		$scope.reset = function() {
			$scope.user = angular.copy($scope.master);
			$scope.actualPassword = undefined;
			$scope.newPassword = undefined;
			$scope.confirmNewPassword = undefined;
		};
	}
]);