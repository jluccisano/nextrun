"use strict";

angular.module("nextrunApp.route").controller("RoutesController",
	function(
		$scope,
		$state,
		$modal,
		$stateParams,
		RouteService,
		notificationService,
		MetaService,
		gettextCatalog) {

		$scope.currentPage = 1;
		$scope.maxSize = 5;
		$scope.totalItems = 0;
		$scope.routes = [];

		$scope.init = function() {

			var promise;

			if($stateParams.id) {
				promise = RouteService.find($stateParams.id, $scope.currentPage);
			} else {
				promise = RouteService.findAll($scope.currentPage);
			}
			
			promise.then(function(response) {
				if (response.data && response.data.items && response.data.items.length > 0) {
					$scope.routes = response.data.items;
					$scope.totalItems = $scope.routes.length;
				} else {
					$scope.totalItems = 0;
					$scope.routes = [];
				}
			}).
			finally(function() {
				MetaService.ready("Mes parcours");
			});
		};

		$scope.addNewRoute = function() {
			$state.go("newRoute");
		};

		$scope.publish = function(route) {

			if (!route.published) {
				RouteService.unpublish(route._id).then(
					function() {
						notificationService.success(gettextCatalog.getString("Votre parcours a bien été retiré	"));
						$scope.init();
					});
			} else {
				RouteService.publish(route._id).then(
					function() {
						notificationService.success(gettextCatalog.getString("Votre parcours a bien été publiée"));
						$scope.init();
					});
			}

		};

		$scope.openDeleteConfirmation = function(route) {
			notificationService.notify({
				title: gettextCatalog.getString("Confirmation requise"),
				text: gettextCatalog.getString("Etes-vous sûr de vouloir supprimer ce parcours ?"),
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
				RouteService.delete(route._id).then(function() {
					notificationService.success(gettextCatalog.getString("Le parcours a bien été supprimé"));
					$scope.init();
				});
			});
		};

		$scope.pageChanged = function() {
			$scope.init();
		};

		$scope.init();
	});