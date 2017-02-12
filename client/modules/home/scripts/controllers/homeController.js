"use strict";

angular.module("nextrunApp.home").controller("HomeController",
    function(
        $scope,
        $state,
        $timeout,
        ContactService,
        notificationService,
        SharedCriteriaService,
        RaceService,
        RouteService,
        RegionEnum,
        RaceTypeEnum,
        MetaService,
        gettextCatalog) {

        $scope.gettextCatalog = gettextCatalog;

        $scope.criteria = {
            radius: 30
        };

        $scope.radius = [{
            value: 30,
            label: "30km"
        }, {
            value: 60,
            label: "60km"
        }, {
            value: 120,
            label: "120km"
        }];

        var initContact = function() {
            $scope.contact = {
                type: "Organisateur"
            };
        };

        $scope.autocomplete = {
            options: {
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

        $scope.submitSearchWithCriteria = function() {
            $timeout(function() {
                SharedCriteriaService.prepForCriteriaBroadcast($scope.criteria);
                $state.go("search");
            }, 1000);

        };

        MetaService.ready("Accueil");
    });