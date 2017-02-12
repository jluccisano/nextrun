"use strict";

angular.module("nextrunApp.race").controller("RichTextEditorModalController",
    function(
        $scope,
        $modalInstance,
        model) {

        $scope.model = {
            text: ""
        };

        $scope.init = function() {
            $scope.model.text = model;
        };

        $scope.submit = function() {
            $modalInstance.close($scope.model);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss("cancel");
        };

        $scope.init();

    });