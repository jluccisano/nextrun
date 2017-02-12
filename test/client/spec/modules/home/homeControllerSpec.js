"use strict";

describe("HomeController", function() {

	var $scope,
		$controller,
		$location,
		$q,
		$timeout,
		mockContactService,
		mockRaceService,
		mockContact,
		mockAlert,
		mockRouteService,
		mockMetaService;

	beforeEach(module("nextrunApp.home", "mockModule"));

	beforeEach(inject(function(_$rootScope_, _$controller_, _$q_, _$location_, _$timeout_, _AlertService_, _MockFactory_, _MetaService_) {
		$scope = _$rootScope_.$new();
		$controller = _$controller_;
		$q = _$q_;
		$location = _$location_;
		$timeout = _$timeout_;
		mockMetaService = _MetaService_;

		mockAlert = _AlertService_;
		mockContact = _MockFactory_.getMockContact();
		mockContactService = _MockFactory_.getMockContactService();
		mockRaceService = _MockFactory_.getMockRaceService();
		mockRouteService = _MockFactory_.getMockRouteService();

		$controller("HomeController", {
			$scope: $scope,
			ContactService: mockContactService,
			RaceService: mockRaceService,
			RouteService: mockRouteService,
			AlertService: mockAlert
		});
	}));


	describe("submit()", function() {
		it("add contact with success", function() {
			mockContactService.setPromiseResponse(true);
			spyOn(mockContactService, "addContact").and.callThrough();
			spyOn(mockAlert, "add");
			$scope.submit(mockContact);
			$scope.$apply();
			expect(mockAlert.add).toHaveBeenCalledWith("success", "message.addContact.successfully", 3000);
			expect(mockContactService.addContact).toHaveBeenCalledWith(mockContact);
		});
	});

	describe("goToNewRace()", function() {
		it("Go to new race with success", function() {
			spyOn($location, "path");
			$scope.goToNewRace();
			expect($location.path).toHaveBeenCalledWith("/races/home");
		});
	});

	describe("submitSearchWithCriteria()", function() {
		it("Go to search with success", function() {
			spyOn($location, "path");
			$scope.submitSearchWithCriteria();
			expect($location.path).toHaveBeenCalledWith("/races/search");
		});
	});

	describe("suggest()", function() {
		it("Suggest with success", function() {
			mockRaceService.setPromiseResponse(true);
			spyOn(mockRaceService, "suggest").and.callThrough();
			$scope.suggest("dua");
			$scope.$apply();
			expect($scope.names.length).toBe(2);
		});
	});

	describe("onSelect()", function() {
		it("select a race with success", function() {
			spyOn($location, "path");

			$scope.names = [{
				id: "12345",
				fullname: "duathlon de Castelnaudary"
			}];

			$scope.onSelect({
				id: "123456",
				fullname: "duathlon de Toulouse"
			});

			$scope.$apply();
			expect($location.path).toHaveBeenCalledWith("/races/view/123456");
		});

		it("Select the suggest go to search with success", function() {
			spyOn($location, "path");

			$scope.names = [];

			$scope.onSelect({
				id: "123456",
				fullname: "duathlon de Toulouse"
			});

			$scope.$apply();
			expect($location.path).toHaveBeenCalledWith("/races/search");
		});
	});

	describe("getRaces()", function() {
		it("get Races with success", function() {
			mockRaceService.setPromiseResponse(true);
			spyOn(mockMetaService, "ready");
			spyOn(mockRaceService, "findAll").and.callThrough();
			spyOn(mockRouteService, "convertRacesLocationToMarkers").and.callThrough();
			$scope.getRaces();
			$scope.$apply();
			expect(mockMetaService.ready).toHaveBeenCalled();
		});
	});
});