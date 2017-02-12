"use strict";

angular.module("nextrunApp.auth").controller("SettingsController",
    function(
        $scope,
        $location,
        $anchorScroll,
        AuthService,
        AlertService,
        MetaService,
        gettextCatalog) {

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
                AlertService.add("success", gettextCatalog.getString("Votre profil a bien été modifié"), 3000);
                $scope.master = angular.copy(response.user);
                $scope.reset();
            });
        };

        $scope.updatePassword = function() {
            AuthService.updatePassword({
                actual: $scope.actualPassword,
                new: $scope.newPassword
            }).then(function(response) {
                AlertService.add("success", gettextCatalog.getString("Votre mot de passe a bien été modifié"), 3000);
                $scope.master = angular.copy(response.user);
                $scope.reset();
            });
        };

        $scope.deleteAccount = function() {
            AuthService.deleteAccount().then(function() {
                AlertService.add("success", gettextCatalog.getString("Votre compte a bien été supprimé"), 3000);
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

        $scope.scrolltoHref = function(id) {
            // set the location.hash to the id of
            // the element you wish to scroll to.
            $location.hash(id);
            // call $anchorScroll()
            $anchorScroll();
        };

        $scope.init();

        MetaService.ready(gettextCatalog.getString("Paramètres"), $location.path(), gettextCatalog.getString("Paramètres"));

    });