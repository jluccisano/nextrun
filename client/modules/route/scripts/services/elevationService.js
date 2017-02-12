"use strict";

angular.module("nextrunApp.route").factory("ElevationService",
	function(GmapsApiService, RouteUtilsService, $q) {

		return {
			getElevation: function(segment) {

				var defer = $q.defer();

				var samplingPoints = segment.getSamplingPoints();
				var samplesLatlng = RouteUtilsService.getAllLatlngFromPoints(samplingPoints);

				GmapsApiService.ElevationService().getElevationForLocations({
					"locations": samplesLatlng
				}, function(result, status) {
					if (status === google.maps.ElevationStatus.OK) {

						var data = {
							samplingPoints: samplingPoints,
							elevations: result
						};

						defer.resolve(data);
					} else {
						defer.reject(status);
					}
				});
				return defer.promise;

			}
		};
	});