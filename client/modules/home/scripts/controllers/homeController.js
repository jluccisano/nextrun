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

        $scope.criteria = {};

        var initContact = function() {
            $scope.contact = {
                type: "Organisateur"
            };
        };

        $scope.autocomplete = {
            options: {
                country: "fr",
                types: "(regions)"
            }
        };

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

        $scope.$watch("criteria.location", function(newValue, oldValue) {
            if (newValue === oldValue) {
                return;
            }
            $scope.submitSearchWithCriteria();
        }, true);


        $scope.submitSearchWithCriteria = function() {
            setTimeout(function() {
                SharedCriteriaService.prepForCriteriaBroadcast($scope.criteria);
                $state.go("search");
            }, 1000);

        };

        MetaService.ready("Accueil");
    });