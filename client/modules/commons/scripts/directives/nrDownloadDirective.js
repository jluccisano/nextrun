"use strict";

angular.module("nextrunApp.commons").directive("nrDownload", function() {
    return {
        restrict: "A",
        replace: true,
        scope: {
            getUrlData: "&getData",
            nrFileName: "@nrFileName"
        },
        link: function($scope, $element) {
            $element.bind("click", function() {
                var name = $scope.nrFileName;
                var href = URL.createObjectURL($scope.getUrlData());
                $element.attr("href", href);
                $element.attr("download", name + ".gpx");
            });
        }
    };
});