'use strict';

describe('EditRaceController', function() {

	var $scope,
		$controller,
		$location,
		$timeout,
		$modal,
		mockRaceService,
		mockRace,
		mockAlertService,
		mockModal,
		mockRouteParams,
		mockRoute,
		mockRouteHelperService,
		mockAuthService,
		mockRouteService,
		mockGpxService,
		mockFileReaderService,
		MetaService;

	beforeEach(module('nextrunApp.race', 'mockModule'));

	beforeEach(inject(function(_$rootScope_, _$controller_, _$location_, _$timeout_, _AlertService_, _$modal_, _MockFactory_, _MetaService_) {
		$scope = _$rootScope_.$new();
		$controller = _$controller_;
		$location = _$location_;
		$timeout = _$timeout_;
		$modal = _$modal_;
		MetaService= _MetaService_;

		mockAuthService = _MockFactory_.getMockAuthService();
		mockRace = _MockFactory_.getMockRace();
		mockAlertService = _AlertService_;
		mockModal = _MockFactory_.getMockModalService();
		mockRaceService = _MockFactory_.getMockRaceService();
		mockFileReaderService = _MockFactory_.getMockFileReaderService();
		mockGpxService = _MockFactory_.getMockGpxService();

		mockRouteParams = {
			raceId: '12345'
		};


		mockRoute = _MockFactory_.getMockRoute();
		mockRouteHelperService = _MockFactory_.getMockRouteHelperService();
		mockRouteService = _MockFactory_.getMockRouteService();


		$controller('EditRaceController', {
			$scope: $scope,
			RaceService: mockRaceService,
			AlertService: mockAlertService,
			RouteHelperService: mockRouteHelperService,
			RouteService: mockRouteService,
			$routeParams: mockRouteParams,
			FileReaderService: mockFileReaderService,
			AuthService: mockAuthService,
			GpxService: mockGpxService
		});

	}));

	/*describe('changeType()', function() {
		it('changeType with success', function() {
			$scope.race = mockRace;
			$scope.$apply();
			spyOn(mockRouteHelperService, 'generateRoute').and.callThrough();
			$scope.changeType();
			expect(mockRouteHelperService.generateRoute).toHaveBeenCalled();
		});
	});*/

	/*describe('init()', function() {
		it('load race with success', function() {
			mockRaceService.setPromiseResponse(true);
			spyOn(mockRaceService, "retrieve").and.callThrough();
			spyOn(MetaService, "ready");

			$scope.raceId = "12345";

			$scope.init();
			$scope.$apply();
			expect(MetaService.ready).toHaveBeenCalled();
			expect($scope.race.name).toEqual(mockRace.name);

		});
	});*/

	/*describe('submit()', function() {
		it('update race with success', function() {
			mockRaceService.setPromiseResponse(true);
			spyOn(mockRaceService, "update").and.callThrough();
			spyOn(mockRaceService, "retrieve").and.callThrough();

			spyOn($location, "path");
			spyOn(mockAlertService, "add");

			$scope.submit(mockRace);

			$scope.$apply();

			expect($location.path).toHaveBeenCalledWith("/myraces");
			expect(mockAlertService.add).toHaveBeenCalled();

		});
	});*/

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
			spyOn(mockAuthService, "isLoggedIn").and.returnValue(true);
			expect($scope.isLoggedIn()).toBe(true);
		});
	});

	/*describe('delete()', function() {
		it('delete with success', function() {
			spyOn(mockRouteService, "delete").and.callThrough();
			$scope.delete();
			expect(mockRouteService.delete).toHaveBeenCalled();
		});
	});

	describe('undo()', function() {
		it('undo with success', function() {
			spyOn(mockRouteService, "undo").and.callThrough();
			$scope.undo();
			expect(mockRouteService.undo).toHaveBeenCalled();
		});
	});*/

	describe('getFile()', function() {
		it('import file with success', function() {
			mockFileReaderService.setPromiseResponse(true);
			spyOn(mockFileReaderService, 'readAsDataUrl').and.callThrough();
			spyOn(mockGpxService, 'convertGPXtoRoute').and.callThrough();
			spyOn(mockRouteService, 'rebuildMarkers').and.callThrough();
			spyOn(mockRouteService, 'rebuildPolylines').and.callThrough();
			spyOn(mockRouteHelperService, 'generateRoute').and.callThrough();
			$scope.getFile(mockRoute, {});
			$scope.$apply();
			expect($scope.pending).toBe(false);
		});

		it('import file with success', function() {
			mockFileReaderService.setPromiseResponse(true);
			spyOn(mockAlertService, "add");
			spyOn(mockFileReaderService, 'readAsDataUrl').and.callThrough();
			spyOn(mockGpxService, 'convertGPXtoRoute').and.callThrough();
			spyOn(mockRouteService, 'rebuildMarkers').and.throwError("invalidGPX");
			spyOn(mockRouteService, 'rebuildPolylines').and.callThrough();
			spyOn(mockRouteHelperService, 'generateRoute').and.callThrough();
			$scope.getFile(mockRoute, {});
			$scope.$apply();
			expect($scope.pending).toBe(false);
			expect(mockAlertService.add).toHaveBeenCalledWith("danger", "invalidGPX", 3000);
		});
	});

});