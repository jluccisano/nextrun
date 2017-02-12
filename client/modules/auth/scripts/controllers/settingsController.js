"use strict";

angular.module("nextrunApp.auth").controller("SettingsController",
    function(
        $scope,
        $location,
        AuthService,
        AlertService,
        MetaService) {

        $scope.user = {};
        $scope.master = {};

        $scope.init = function() {
            AuthService.getUserProfile().then(
                function(response) {
                    $scope.master = angular.copy(response.user);
                    $scope.reset();
                });
        };


        $scope.updateProfile = function() {
            AuthService.updateProfile({
                user: $scope.user
            }).then(function(response) {
                AlertService.add("success", "message.update.successfully", 3000);
                $scope.master = angular.copy(response.user);
                $scope.reset();
            });
        };

        $scope.updatePassword = function() {
            AuthService.updatePassword({
                actual: $scope.actualPassword,
                new: $scope.newPassword
            }).then(function(response) {
                AlertService.add("success", "message.update.successfully", 3000);
                $scope.master = angular.copy(response.user);
                $scope.reset();
            });
        };

        $scope.deleteAccount = function() {
            AuthService.deleteAccount().then(function() {
                AlertService.add("success", "message.account.deleted.successfully", 3000);
                $location.path("/");
            });
        };

        $scope.isUnchanged = function(user) {
            return angular.equals(user, $scope.master);
        };

        $scope.reset = function() {
            $scope.user = angular.copy($scope.master);
            $scope.actualPassword = undefined;
            $scope.newPassword = undefined;
            $scope.confirmNewPassword = undefined;
        };

        $scope.init();

        MetaService.ready("title.settings", $location.path(), "message.settings.description");

    });