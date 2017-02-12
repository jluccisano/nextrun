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
			country: "fr",
			types: "(cities)"
		};

		$scope.types = RaceTypeEnum.getValues();

		$scope.submit = function() {
			var data = {
				race: $scope.race
			};

			$cookieStore.put('race', $scope.race);

			RaceService.create(data).then(function(response) {
				notificationService.success(gettextCatalog.getString("La manifestation a bien été créée"));
				$scope.openRedirectionModal(response.data.raceId);
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

			
			/*$scope.modalInstance = $modal.open({
				templateUrl: "partials/race/redirectionModal",
				controller: "RedirectionModalController",
				resolve: {
					raceId: function() {
						return raceId;
					}
				}
			});*/
		};

		MetaService.ready("Ajouter une manifestation");
	});