"use strict";

angular.module("nextrunApp.home").controller("HomeController",
    function(
        $scope,
        $state,
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
            $state.go("races");
        };

        $scope.submitSearchWithCriteria = function() {
            $state.go("search");
            setTimeout(function() {
                SharedCriteriaService.prepForCriteriaBroadcast($scope.criteria);
            }, 1000);
        };

        MetaService.ready("Accueil");
    });