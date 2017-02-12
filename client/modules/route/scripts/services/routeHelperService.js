"use strict";

angular.module("nextrunApp.route").factory("RouteHelperService",
    function() {

        return {
            getChartConfig: function($scope, height) {
                return {
                    loading: false,
                    options: {
                        chart: {
                            zoomType: "xy",
                            height: height,
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
                                                id: routeBuilder.generateUUID(),
                                                latitude: this.lat,
                                                longitude: this.lng,
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

            },
            getGmapsConfig: function() {
                return {
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
            }
        };
    });