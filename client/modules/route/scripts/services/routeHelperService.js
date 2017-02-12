"use strict";

angular.module("nextrunApp.route").factory("RouteHelperService",
    function(RouteService) {
        
        var googleMapsConfig = {
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            mapTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.ROADMAP,
                    google.maps.MapTypeId.HYBRID,
                    google.maps.MapTypeId.SATELLITE,
                    google.maps.MapTypeId.TERRAIN
                ],
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
            },
            disableDoubleClickZoom: true,
            scrollwheel: true,
            draggableCursor: "crosshair",
            streetViewControl: false,
            zoomControl: true
        };

        var chartConfig = function($scope) {

            return {
                loading: false,
                options: {
                    chart: {
                        zoomType: "xy",
                        height: 300,
                        type: "area"
                    },
                    plotOptions: {
                        series: {
                            turboThreshold: 0,
                            marker: {
                                enabled: false
                            },
                            point: {
                                events: {
                                    mouseOver: function() {

                                        var icon = new google.maps.MarkerImage("client/modules/route/images/segment.png",
                                            new google.maps.Size(32, 32),
                                            new google.maps.Point(0, 0),
                                            new google.maps.Point(8, 8),
                                            new google.maps.Size(16, 16)
                                        );

                                        var cursorMarker = {
                                            latitude: this.latlng.mb,
                                            longitude: this.latlng.nb,
                                            icon: icon,
                                            title: "hello"
                                        };

                                        $scope.cursorMarker = cursorMarker;
                                        $scope.$apply();


                                    },
                                    mouseOut: function() {
                                        $scope.cursorMarker = {};
                                        $scope.$apply();

                                    }

                                }
                            },
                            events: {
                                mouseOut: function() {
                                    $scope.cursorMarker = {};
                                    $scope.$apply();
                                }
                            }
                        },
                        column: {
                            colorByPoint: true
                        }
                    },
                    tooltip: {
                        shared: false,
                        useHTML: true,
                        headerFormat: "<table>",
                        pointFormat: "<tr>" +
                            "<td>Distance: </td>" +
                            "<td style='text-align: right'><b>{point.x} Km</b></td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td>Altitude: </td>" +
                            "<td style='text-align: right'><b>{point.y} m</b></td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td>Pente: </td>" +
                            "<td style='text-align: right'><b>{point.grade} %</b></td>" +
                            "</tr>",
                        footerFormat: "</table>",
                        valueDecimals: 0,
                        crosshairs: true
                    }
                },
                series: [{
                    name: "< 5%",
                    data: [],
                    color: "#428bca",
                    enableMouseTracking: true,
                    fillOpacity: 0.8,
                    lineColor: "#303030"
                }, {
                    name: "< 7%",
                    data: [],
                    color: "#feb63e",
                    enableMouseTracking: false,
                    fillOpacity: 0.8,
                    lineColor: "#303030"
                }, {
                    name: "< 10% ",
                    data: [],
                    color: "#ff7638",
                    enableMouseTracking: false,
                    fillOpacity: 0.8,
                    lineColor: "#303030"
                }, {
                    name: "< 15% ",
                    data: [],
                    color: "#a81a10",
                    enableMouseTracking: false,
                    fillOpacity: 0.8,
                    lineColor: "#303030"
                }, {
                    name: "> 15% ",
                    data: [],
                    color: "#451e0f ",
                    enableMouseTracking: false,
                    fillOpacity: 0.8,
                    lineColor: "#303030"
                }],
                xAxis: {
                    title: {
                        text: "Distance (km)",
                        align: "middle"
                    }
                },
                yAxis: {
                    title: {
                        text: "Altitude (m)",
                        align: "middle"
                    }
                },
                title: {
                    text: ""
                }
            };
        };

        var setCenter = function(scope, currentRoute) {

            //default France center
            var center = {
                latitude: 46.52863469527167,
                longitude: 2.43896484375,
            };

            if (currentRoute.segments.length === 0) {

                if (!_.isUndefined(scope.race.pin)) {
                    if (!_.isUndefined(scope.race.pin.location)) {
                        center = {
                            latitude: scope.race.pin.location.lat,
                            longitude: scope.race.pin.location.lon
                        };
                    } else {
                        //set the department of location
                        center = scope.race.pin.department.center;
                    }
                }

            }
            return center;
        };

        return {
            generateRoute: function(scope, currentRoute, routeType) {

                var route = {
                    isVisible: false,
                    editMode: true,
                    segments: (currentRoute && !_.isUndefined(currentRoute.segments) && currentRoute.segments.length > 0) ? currentRoute.segments : [],
                    description: (currentRoute && !_.isUndefined(currentRoute.description)) ? currentRoute.description : "",
                    distance: (currentRoute && !_.isUndefined(currentRoute.distance)) ? currentRoute.distance : 0,
                    descendant: (currentRoute && !_.isUndefined(currentRoute.descendant)) ? currentRoute.descendant : 0,
                    ascendant: (currentRoute && !_.isUndefined(currentRoute.ascendant)) ? currentRoute.ascendant : 0,
                    minElevation: (currentRoute && !_.isUndefined(currentRoute.minElevation)) ? currentRoute.minElevation : 0,
                    maxElevation: (currentRoute && !_.isUndefined(currentRoute.maxElevation)) ? currentRoute.maxElevation : 0,
                    elevationPoints: (currentRoute && !_.isUndefined(currentRoute.elevationPoints) && currentRoute.elevationPoints.length > 0) ? currentRoute.elevationPoints : [],
                    type: (routeType && !_.isUndefined(routeType.i18n)) ? routeType.i18n : "",
                    travelMode: google.maps.TravelMode.DRIVING,
                    zoom: 13,
                    fit: true,
                    markers: [],
                    polylines: [],
                    center: setCenter(scope, currentRoute),
                    options: googleMapsConfig,
                    events: {},
                    chartConfig: chartConfig(scope)
                };

                route.events = {
                    click: function(mapModel, eventName, originalEventArgs) {
                        RouteService.onClickMap(scope, route, originalEventArgs[0].latLng);
                    }
                };

                if (route.elevationPoints.length > 0) {
                    RouteService.rebuildElevationChart(route);
                }

                if (route.segments.length > 0) {
                    route.markers = RouteService.rebuildMarkers(route.segments, true);
                    route.polylines = RouteService.rebuildPolylines(route.segments);
                }

                return route;
            }
        };
    });