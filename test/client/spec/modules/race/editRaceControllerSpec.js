'use strict';

describe('EditRaceController', function() {

	var $scope,
		$controller,
		$location,
		$timeout,
		$modal,
		mockRaceServices,
		mockRace,
		mockAlert,
		mockModal,
		mockRouteParams,
		mockRoute,
		mockRouteHelperServices,
		mockAuthServices,
		mockRouteServices,
		mockGpxServices,
		mockFileReaderServices,
		metaBuilder;

	beforeEach(module('nextrunApp.race', 'mockModule'));

	beforeEach(inject(function(_$rootScope_, _$controller_, _$location_, _$timeout_, _Alert_, _$modal_, _MockFactory_, _metaBuilder_) {
		$scope = _$rootScope_.$new();
		$controller = _$controller_;
		$location = _$location_;
		$timeout = _$timeout_;
		$modal = _$modal_;
		metaBuilder= _metaBuilder_;

		mockAuthServices = _MockFactory_.getMockAuthServices();
		mockRace = _MockFactory_.getMockRace();
		mockAlert = _Alert_;
		mockModal = _MockFactory_.getMockModalServices();
		mockRaceServices = _MockFactory_.getMockRaceServices();
		mockFileReaderServices = _MockFactory_.getMockFileReaderServices();
		mockGpxServices = _MockFactory_.getMockGpxServices();

		mockRouteParams = {
			raceId: '12345'
		};


		mockRoute = _MockFactory_.getMockRoute();
		mockRouteHelperServices = _MockFactory_.getMockRouteHelperServices();
		mockRouteServices = _MockFactory_.getMockRouteServices();


		$controller('EditRaceController', {
			$scope: $scope,
			RaceServices: mockRaceServices,
			Alert: mockAlert,
			RouteHelperServices: mockRouteHelperServices,
			RouteServices: mockRouteServices,
			$routeParams: mockRouteParams,
			fileReader: mockFileReaderServices,
			AuthServices: mockAuthServices,
			GpxServices: mockGpxServices
		});

	}));

	describe('changeType()', function() {
		it('changeType with success', function() {
			$scope.race = mockRace;
			$scope.$apply();
			spyOn(mockRouteHelperServices, 'generateRoute').and.callThrough();
			$scope.changeType();
			expect(mockRouteHelperServices.generateRoute).toHaveBeenCalled();
		});
	});

	describe('init()', function() {
		it('load race with success', function() {
			mockRaceServices.setPromiseResponse(true);
			spyOn(mockRaceServices, "retrieve").and.callThrough();
			spyOn(metaBuilder, "ready");

			$scope.raceId = "12345";

			$scope.init();
			$scope.$apply();
			expect(metaBuilder.ready).toHaveBeenCalled();
			expect($scope.race.name).toEqual(mockRace.name);

		});
	});

	describe('submit()', function() {
		it('update race with success', function() {
			mockRaceServices.setPromiseResponse(true);
			spyOn(mockRaceServices, "update").and.callThrough();
			spyOn(mockRaceServices, "retrieve").and.callThrough();

			spyOn($location, "path");
			spyOn(mockAlert, "add");

			$scope.submit(mockRace);

			$scope.$apply();

			expect($location.path).toHaveBeenCalledWith("/myraces");
			expect(mockAlert.add).toHaveBeenCalledWith("success", "message.update.successfully", 3000);

		});
	});

	describe('openChangeTypeConfirmation modal()', function() {
		it('should change type when the modal close is called', function() {
			$scope.race = mockRace;
			spyOn($modal, 'open').and.returnValue(mockModal);
			spyOn($scope, 'changeType');

			$scope.openChangeTypeConfirmation(mockRace);

			$scope.$apply();

			$scope.modalInstance.close();
			expect($scope.changeType).toHaveBeenCalled();
		});

		it('should not change the type of race when the modal dismiss is called', function() {
			$scope.race = mockRace;

			spyOn($modal, 'open').and.returnValue(mockModal);

			$scope.openChangeTypeConfirmation(mockRace);

			$scope.$apply();

			$scope.modalInstance.dismiss("cancel");

			expect($scope.race.type).toEqual(mockRace.type);
		});
	});

	describe('cancel()', function() {
		it('cancel with success', function() {
			spyOn($location, "path");
			$scope.cancel();
			expect($location.path).toHaveBeenCalledWith("/myraces");
		});
	});

	describe('isLoggedIn()', function() {
		it('isLoggedIn with success', function() {
			spyOn(mockAuthServices, "isLoggedIn").and.returnValue(true);
			expect($scope.isLoggedIn()).toBe(true);
		});
	});

	describe('delete()', function() {
		it('delete with success', function() {
			spyOn(mockRouteServices, "delete").and.callThrough();
			$scope.delete();
			expect(mockRouteServices.delete).toHaveBeenCalled();
		});
	});

	describe('undo()', function() {
		it('undo with success', function() {
			spyOn(mockRouteServices, "undo").and.callThrough();
			$scope.undo();
			expect(mockRouteServices.undo).toHaveBeenCalled();
		});
	});

	describe('getFile()', function() {
		it('import file with success', function() {
			mockFileReaderServices.setPromiseResponse(true);
			spyOn(mockFileReaderServices, 'readAsDataUrl').and.callThrough();
			spyOn(mockGpxServices, 'convertGPXtoRoute').and.callThrough();
			spyOn(mockRouteServices, 'rebuildMarkers').and.callThrough();
			spyOn(mockRouteServices, 'rebuildPolylines').and.callThrough();
			spyOn(mockRouteHelperServices, 'generateRoute').and.callThrough();
			$scope.getFile(mockRoute, {});
			$scope.$apply();
			expect($scope.pending).toBe(false);
		});

		it('import file with success', function() {
			mockFileReaderServices.setPromiseResponse(true);
			spyOn(mockAlert, "add");
			spyOn(mockFileReaderServices, 'readAsDataUrl').and.callThrough();
			spyOn(mockGpxServices, 'convertGPXtoRoute').and.callThrough();
			spyOn(mockRouteServices, 'rebuildMarkers').and.throwError("invalidGPX");
			spyOn(mockRouteServices, 'rebuildPolylines').and.callThrough();
			spyOn(mockRouteHelperServices, 'generateRoute').and.callThrough();
			$scope.getFile(mockRoute, {});
			$scope.$apply();
			expect($scope.pending).toBe(false);
			expect(mockAlert.add).toHaveBeenCalledWith("danger", "invalidGPX", 3000);
		});
	});

});