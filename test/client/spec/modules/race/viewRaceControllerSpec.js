'use strict';

describe('ViewRaceController', function() {

	var $scope,
		$controller,
		$location,
		$q,
		$timeout,
		$modal,
		mockRaceServices,
		mockRace,
		mockAlert,
		mockModal,
		mockTypeEnum,
		mockRouteHelperServices,
		metaBuilder;

	beforeEach(module('nextrunApp.race', 'mockModule'));

	beforeEach(inject(function(_$rootScope_, _$controller_, _$q_, _$location_, _$timeout_, _Alert_, _$modal_, _MockFactory_,_typeEnum_,_metaBuilder_) {
		$scope = _$rootScope_.$new();
		$controller = _$controller_;
		$q = _$q_;
		$location = _$location_;
		metaBuilder = _metaBuilder_;
		$timeout = _$timeout_;
		$modal = _$modal_;
		mockAlert = _Alert_;
		mockTypeEnum = _typeEnum_;
		mockModal = _MockFactory_.getMockModalServices();
		mockRace = _MockFactory_.getMockRace();
		mockRaceServices = _MockFactory_.getMockRaceServices();
		mockRouteHelperServices = _MockFactory_.getMockRouteHelperServices();

		$controller('ViewRaceController', {
			$scope: $scope,
			RaceServices: mockRaceServices,
			Alert: mockAlert,
			RouteHelperServices: mockRouteHelperServices
		});
	}));

	describe('init()', function() {
		it('load race with success', function() {
			mockRaceServices.setPromiseResponse(true);
			spyOn(mockRaceServices, "retrieve").and.callThrough();
			spyOn(mockRouteHelperServices, "generateRoute").and.callThrough();

			spyOn(mockTypeEnum, "getRaceTypeByName").and.returnValue({
				i18n: "Course à pied",
				name: 'running',
				distances: [{
					name: '3km',
					i18n: '3km'
				}, {
					name: '5km',
					i18n: '5km'
				}, {
					name: '10km',
					i18n: '10km'
				}, {
					name: 'Semi-Marathon',
					i18n: 'Semi-Marathon - 21,1km'
				}, {
					name: 'Marathon',
					i18n: 'Marathon - 42,195km'
				}, {
					name: '100km',
					i18n: '100km'
				}],
				routes: [{
					name: 'running',
					i18n: 'Course à pied'
				}]
			});

			spyOn(metaBuilder, "ready");

			$scope.raceId = "12345";

			$scope.init();
			$scope.$apply();
			expect(metaBuilder.ready).toHaveBeenCalled();
			expect($scope.race.name).toEqual(mockRace.name);

		});
	});

	describe('open feedback modal()', function() {
		it('should call init when the modal close is called', function() {
			spyOn($modal, 'open').and.returnValue(mockModal);
			$scope.openFeedbackModal("12345");
		});
	});
});