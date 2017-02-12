"use strict";

angular.module("nextrunApp.auth").controller("UsersController",
	function(
		$scope,
		$state,
		$modal,
		AuthService,
		notificationService,
		MetaService,
		gettextCatalog) {

		$scope.currentPage = 1;
		$scope.maxSize = 5;
		$scope.totalItems = 0;
		$scope.users = [];

		$scope.init = function() {
			AuthService.find($scope.currentPage).then(function(response) {
				if (response.data && response.data.items && response.data.items.length > 0) {
					$scope.users = response.data.items;
					$scope.totalItems = $scope.users.length;
				} else {
					$scope.totalItems = 0;
					$scope.users = [];
				}
			});
		};

		$scope.addNewUser = function() {
			$state.go("newUser");
		};

		$scope.publish = function(user, value) {
			AuthService.publish(user._id, value).then(function() {
				notificationService.success(gettextCatalog.getString("Votre utilisateur a bien été publiée"));
				$scope.init();
			});
		};

		$scope.openDeleteConfirmation = function(user) {
			notificationService.notify({
				title: gettextCatalog.getString("Confirmation requise"),
				text: gettextCatalog.getString("Etes-vous sûr de vouloir supprimer ce utilisateur ?"),
				hide: false,
				confirm: {
					confirm: true
				},
				buttons: {
					closer: false,
					sticker: false
				},
				history: {
					history: false
				}
			}).get().on('pnotify.confirm', function() {
				AuthService.delete(user._id).then(function() {
					notificationService.success(gettextCatalog.getString("Le utilisateur a bien été supprimé"));
					$scope.init();
				});
			});
		};

		$scope.pageChanged = function() {
			$scope.init();
		};

		$scope.init();
	});