"use strict";

angular.module("nextrunApp.commons").directive("nrDownload", function($compile) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            getUrlData: "&getData"
        },
        link: function(scope, elm) {
            var url = URL.createObjectURL(scope.getUrlData());
            elm.append($compile(
                "<a download='export.gpx'" +
                "href='" + url + "'>" +
                "Exporter GPX" +
                "</a>"
            )(scope));
        }
    };
});