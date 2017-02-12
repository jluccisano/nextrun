"use strict";

angular.module("nextrunApp.commons").directive("nrAsyncDownload", function() {
    return {
        restrict: "A",
        replace: true,
        scope: {
            getUrlData: "&getData",
            nrFileName: "@nrFileName"
        },
        link: function($scope, $element) {
            $scope.data = undefined;

            $element.bind("click", function(evt) {
                var name = $scope.nrFileName;
                if (!$scope.data) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    $scope.getUrlData().then(function(data) {
                        $scope.data = data;
                        $scope.triggerDownload();
                    });
                } else {
                    //format application/pdf - 
                    $element.attr("href", 'data:application/pdf;base64,'+$scope.data);
                    $element.attr("download", name);
                    $scope.data = undefined;
                }

                $scope.triggerDownload = function() {
                    var event = document.createEvent('MouseEvents');
                    event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
                    $element[0].dispatchEvent(event);
                };
            });
        }
    };
});