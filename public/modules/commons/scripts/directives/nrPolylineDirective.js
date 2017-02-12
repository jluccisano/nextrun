"use strict";

angular.module("google-maps").directive("nrPolyline",
    function($log, $timeout, GmapsApiService) {

        function validatePathPoints(path) {
            for (var i = 0; i < path.length; i++) {
                if (angular.isUndefined(path[i].latitude) ||
                    angular.isUndefined(path[i].longitude)) {
                    return false;
                }
            }

            return true;
        }

        /*
         * Utility functions
         */
        return {
            restrict: "ECA",
            replace: true,
            require: ["^googleMap"],
            scope: {
                polylines: "="
            },
            link: function(scope, element, attrs, mapCtrl) {

                // Wrap polyline initialization inside a $timeout() call to make sure the map is created already
                $timeout(function() {

                    var map = mapCtrl[0].getMap();


                    var bounds = GmapsApiService.LatLngBounds();
                    var pathPoints = [];
                    var polyline;

                    scope.$watch("polylines", function(value) {
                        if (value) {

                            if (polyline) {
                                polyline.setMap(null);
                                pathPoints = [];
                                bounds = GmapsApiService.LatLngBounds();
                            }


                            for (var p = 0; p < value.length; p++) {

                                var path = value[p].path;

                                if (angular.isUndefined(path) ||
                                    path === null ||
                                    path.length < 0 || !validatePathPoints(path)) {

                                    $log.error("polyline: no valid path attribute found");
                                    return;
                                }

                                for (var i = 0; i < path.length; i++) {

                                    var point = GmapsApiService.LatLng(path[i].latitude, path[i].longitude);
                                    pathPoints.push(point);
                                    bounds.extend(point);
                                }
                            }


                            if (pathPoints.length > 0) {

                                map.fitBounds(bounds);

                                polyline = GmapsApiService.Polyline({
                                    map: map,
                                    path: pathPoints,
                                    strokeColor: "#FF0000",
                                    strokeOpacity: 1.0,
                                    strokeWeight: 5
                                });

                            }

                        }
                    }, true);

                    // Remove polyline on scope $destroy
                    scope.$on("$destroy", function() {
                        if (typeof polyline !== "undefined") {
                            polyline.setMap(null);
                        }
                    });
                });
            }
        };
    });