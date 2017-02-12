"use strict";

angular.module("nextrunApp.race").controller("CreateRaceController",
	function(
		$rootScope,
		$scope,
		$modal,
		$state,
		$cookieStore,
		RaceService,
		notificationService,
		RaceTypeEnum,
		MetaService,
		gettextCatalog) {

		$scope.gettextCatalog = gettextCatalog;

		var race = $cookieStore.get("race");

		if (race) {
			$scope.race = race;
		} else {
			$scope.race = {};
		}

		$scope.options = {
			types: "(cities)"
		};

		$scope.types = RaceTypeEnum.getValues();

		$scope.submit = function() {
			$cookieStore.put('race', $scope.race);

			RaceService.create($scope.race).then(function(response) {
				notificationService.success(gettextCatalog.getString("La manifestation a bien été créée"));
				$scope.openRedirectionModal(response.data.id);
				$cookieStore.remove("race");
			});
		};

		$scope.openRedirectionModal = function(raceId) {
			notificationService.notify({
				title: gettextCatalog.getString("Confirmation requise"),
				text: gettextCatalog.getString("Souhaitez-vous éditer votre manifestation maintenant?"),
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
				$state.go("edit", {id: raceId});
			}).on('pnotify.cancel', function() {
				$state.go("myraces");
			});
		};

		MetaService.ready("Ajouter une manifestation");
	});