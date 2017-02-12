angular.module("nextrunApp.workout").controller("CreateWorkoutController",
	function(
		$rootScope,
		$scope,
		$modal,
		$state,
		$cookieStore,
		WorkoutService,
		notificationService,
		MetaService,
		gettextCatalog, 
		routeId) {

		$scope.gettextCatalog = gettextCatalog;

		$scope.guests = [];
		$scope.repeats = [];
		$scope.rejects = [];

		var workout = $cookieStore.get("workout");

		if (workout) {
			$scope.workout = workout;
		} else {
			$scope.workout = {};
		}

		$scope.options = {
			types: "geocode"
		};

		$scope.init = function() {
			if(routeId) {
				$scope.workout.routeId = routeId;
			}
			MetaService.ready("Ajouter une sortie");
		};

		$scope.submit = function() {
			$cookieStore.put("workout", $scope.workout);

			$scope.workout.participants = [];

			angular.forEach($scope.guests, function(guest) {
				var participant = {
					email: guest
				};
				$scope.workout.participants.push(participant);

			});

			WorkoutService.saveOrUpdate($scope.workout).then(
				function(response) {
					$scope.openRedirectionModal(response.data.id);
					notificationService.success(gettextCatalog.getString("Votre sortie a bien été créée"));
					$cookieStore.remove("workout");

				});
		};

		$scope.openRedirectionModal = function(workoutId) {
			notificationService.notify({
				title: gettextCatalog.getString("Confirmation requise"),
				text: gettextCatalog.getString("Souhaitez-vous éditer votre sortie maintenant?"),
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
			}).get().on("pnotify.confirm", function() {
				$state.go("editWorkout", {
					id: workoutId
				});
			}).on("pnotify.cancel", function() {
				$state.go("myworkouts");
			});
		};

		$scope.init();
	});