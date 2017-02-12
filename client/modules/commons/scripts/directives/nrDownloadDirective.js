"use strict";

angular.module("nextrunApp.commons").directive("nrDownload", function($compile) {
    return {
        restrict: "A",
        replace: true,
        scope: {
            getUrlData: "&getData",
            nrFileName: "@nrFileName"
        },
        link: function($scope, $element, $attrs) {
            $element.bind('click', function(event) {
                var name = $scope.nrFileName;
                var href = URL.createObjectURL($scope.getUrlData());
                $element.attr("href", href);
                $element.attr("download", name + ".gpx");
            });
        }
    };
});