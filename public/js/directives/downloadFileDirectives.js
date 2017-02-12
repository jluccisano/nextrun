angular.module('nextrunApp').directive('ngDownload', function ($compile) {
    'use strict';
    return {
        restrict:'E',
        scope:{ 
            getUrlData:'&getData'
        },
        link:function (scope, elm, attrs) {
            var url = URL.createObjectURL(scope.getUrlData());
            elm.append($compile(
                '<a class="btn" download="export.gpx"' +
                    'href="' + url + '">' +
                    'Exporter GPX' +
                    '</a>'
            )(scope));
        }
    };
});