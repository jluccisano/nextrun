'use strict';

describe('HomeController', function() {

	var $scope,
		$controller,
		$location,
		$q,
		$timeout,
		mockContactServices,
		mockRaceServices,
		mockContact,
		mockRace,
		mockAlert,
		mockRouteServices,
		metaBuilder;

	beforeEach(module('nextrunApp.home', 'mockModule'));

	beforeEach(inject(function(_$rootScope_, _$controller_, _$q_, _$location_, _$timeout_, _Alert_, _MockFactory_,_metaBuilder_) {
		$scope = _$rootScope_.$new();
		$controller = _$controller_;
		$q = _$q_;
		$location = _$location_;
		$timeout = _$timeout_;
		metaBuilder = _metaBuilder_;

		mockAlert = _Alert_;
		mockContact = _MockFactory_.getMockContact();
		mockContactServices = _MockFactory_.getMockContactServices();
		mockRaceServices = _MockFactory_.getMockRaceServices();
		mockRouteServices = _MockFactory_.getMockRouteServices();

		$controller('HomeController', {
			$scope: $scope,
			ContactServices: mockContactServices,
			RaceServices: mockRaceServices,
			RouteServices: mockRouteServices,
			Alert: mockAlert
		});
	}));


	describe('submit()', function() {
		it('add contact with success', function() {
			mockContactServices.setPromiseResponse(true);
			spyOn(mockContactServices, "addContact").and.callThrough();
			spyOn(mockAlert, "add");
			$scope.submit(mockContact);
			$scope.$apply();
			expect(mockAlert.add).toHaveBeenCalledWith("success", "message.addContact.successfully", 3000);
			expect(mockContactServices.addContact).toHaveBeenCalledWith(mockContact);
		});
	});

	describe('goToNewRace()', function() {
		it('Go to new race with success', function() {
			spyOn($location, "path");
			$scope.goToNewRace();
			expect($location.path).toHaveBeenCalledWith("/races/home");
		});
	});

	describe('submitSearchWithCriteria()', function() {
		it('Go to search with success', function() {
			spyOn($location, "path");
			$scope.submitSearchWithCriteria();
			expect($location.path).toHaveBeenCalledWith("/races/search");
		});
	});

	describe('suggest()', function() {
		it('Suggest with success', function() {
			mockRaceServices.setPromiseResponse(true);
			spyOn(mockRaceServices, "suggest").and.callThrough();
			$scope.suggest("dua");
			$scope.$apply();
			expect($scope.names.length).toBe(2);
		});
	});

	describe('onSelect()', function() {
		it('select a race with success', function() {
			spyOn($location, "path");

			$scope.names = [{
				id: "12345",
				fullname: "duathlon de Castelnaudary"
			}]

			$scope.onSelect({
				id: "123456",
				fullname: "duathlon de Toulouse"
			});

			$scope.$apply();
			expect($location.path).toHaveBeenCalledWith("/races/view/123456");
		});

		it('Select the suggest go to search with success', function() {
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

	describe('getRaces()', function() {
		it('get Races with success', function() {
			mockRaceServices.setPromiseResponse(true);
			spyOn(metaBuilder, "ready");
			spyOn(mockRaceServices, "findAll").and.callThrough();
			spyOn(mockRouteServices, "convertRacesLocationToMarkers").and.callThrough();
			$scope.getRaces();
			$scope.$apply();
			expect(metaBuilder.ready).toHaveBeenCalled();
		});
	});

});