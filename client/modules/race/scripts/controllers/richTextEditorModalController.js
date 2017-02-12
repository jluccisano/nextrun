"use strict";

angular.module("nextrunApp.race").controller("RichTextEditorModalController",
    function(
        $scope,
        $modalInstance,
        content) {

        $scope.init = function() {
            $scope.content = content;
        };

        $scope.submit = function() {
            $modalInstance.close($scope.content);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss("cancel");
        };

        $scope.init();
    });