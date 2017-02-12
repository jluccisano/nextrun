"use strict";

angular.module("nextrunApp.home").controller("HomeController",
    function(
        $scope,
        $location,
        ContactService,
        notificationService,
        SharedCriteriaService,
        RaceService,
        RouteService,
        RegionEnum,
        RaceTypeEnum,
        MetaService,
        gettextCatalog) {

        var initContact = function() {
            $scope.contact = {
                type: "Organisateur"
            };
        };

        var initAutocomplete = function() {
            $scope.autocomplete = {
                options: {
                    country: "fr",
                    types: "(cities)"
                }
            };
        };

        initAutocomplete();
        initContact();

        $scope.listOfTypes = RaceTypeEnum.getValues();

        $scope.submit = function(contact) {
            ContactService.addContact(contact).then(
                function() {
                    notificationService.success(gettextCatalog.getString("Le contact a été ajouté"));
                });
        };

        $scope.goToNewRace = function() {
            $location.path("/races/home");
        };

        $scope.submitSearchWithCriteria = function() {
            $location.path("/races/search");
            setTimeout(function() {
                SharedCriteriaService.prepForCriteriaBroadcast($scope.criteria);
            }, 1000);
        };

        MetaService.ready(gettextCatalog.getString("Accueil"), $location.path(), gettextCatalog.getString("Accueil"));
    });