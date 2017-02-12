"use strict";

angular.module("nextrunApp.home").controller("ContactsController",
	function(
		$scope,
		$state,
		$modal,
		ContactService,
		notificationService,
		MetaService,
		gettextCatalog) {

		$scope.currentPage = 1;
		$scope.maxSize = 5;
		$scope.totalItems = 0;
		$scope.contacts = [];

		$scope.init = function() {
			ContactService.find($scope.currentPage).then(function(response) {
				if (response.data && response.data.items && response.data.items.length > 0) {
					$scope.contacts = response.data.items;
					$scope.totalItems = $scope.contacts.length;
				} else {
					$scope.totalItems = 0;
					$scope.contacts = [];
				}
			});
		};

		$scope.addNewContact = function() {
			$state.go("newContact");
		};

		$scope.publish = function(contact, value) {
			ContactService.publish(contact._id, value).then(function() {
				notificationService.success(gettextCatalog.getString("Votre contact a bien été publiée"));
				$scope.init();
			});
		};

		$scope.openDeleteConfirmation = function(contact) {
			notificationService.notify({
				title: gettextCatalog.getString("Confirmation requise"),
				text: gettextCatalog.getString("Etes-vous sûr de vouloir supprimer ce contact ?"),
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
				ContactService.delete(contact._id).then(function() {
					notificationService.success(gettextCatalog.getString("Le contact a bien été supprimé"));
					$scope.init();
				});
			});
		};

		$scope.pageChanged = function() {
			$scope.init();
		};

		$scope.init();
	});