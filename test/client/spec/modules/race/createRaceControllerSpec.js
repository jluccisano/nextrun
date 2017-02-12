'use strict';

describe('MyRacesController', function() {

	var $scope, $controller, $location, $q, $modal, mockRaceService, mockRace, mockModal, mockAlertService, mockAuthService, mockUser, MetaService;

	beforeEach(module('nextrunApp.race', 'mockModule'));

	beforeEach(inject(function(_$rootScope_, _$controller_, _$q_, _$location_, _$modal_, _AlertService_,_MockFactory_, _MetaService_) {
		$scope = _$rootScope_.$new();
		$controller = _$controller_;
		$q = _$q_;
		$location = _$location_;
		MetaService = _MetaService_;
		$modal = _$modal_;
		mockAlertService = _AlertService_;
		mockUser = _MockFactory_.getMockUser();
		mockRace = _MockFactory_.getMockRace();
		mockModal = _MockFactory_.getMockModalService();
		mockRaceService = _MockFactory_.getMockRaceService();
		mockAuthService = _MockFactory_.getMockAuthService();

		spyOn(MetaService, "ready");

		$controller('CreateRaceController', {
			$scope: $scope,
			RaceService: mockRaceService,
			AuthService: mockAuthService,
			AlertService: mockAlertService
		});


		expect(MetaService.ready).toHaveBeenCalled();

	}));

	describe('submit()', function() {

		it('submit with success when user isLoggedIn', function() {
			mockRaceService.setPromiseResponse(true);

			$scope.race = mockRace;

			spyOn($scope, "isLoggedIn").and.returnValue(true);
			spyOn(mockAlertService, "add");
			spyOn($scope, "openRedirectionModal");
			spyOn(mockRaceService, "create").and.callThrough();

			$scope.submit();
			$scope.$apply();

			expect(mockAlertService.add).toHaveBeenCalledWith("success", "message.create.successfully", 3000);
			expect($scope.openRedirectionModal).toHaveBeenCalledWith(mockRace._id);

		});

		it('redirect to login tab when user not isLoggedIn', function() {
			$scope.race = mockRace;
			spyOn($scope, "isLoggedIn").and.returnValue(false);
			$scope.submit();
			expect($scope.tabs[1].active).toBe(true);
		});

	});

	describe('signup()', function() {

		it('signup with success', function() {
			mockAuthService.setPromiseResponse(true);


			spyOn(mockAuthService, "register").and.callThrough();
			spyOn($scope, "submit");

			$scope.signup();
			$scope.$apply();

			expect($scope.submit).toHaveBeenCalled();
		});

	});

	describe('login()', function() {

		it('signup with success', function() {
			mockAuthService.setPromiseResponse(true);
			$scope.user = mockUser;

			spyOn(mockAuthService, "login").and.callThrough();
			spyOn($scope, "submit");

			$scope.login();
			$scope.$apply();

			expect($scope.submit).toHaveBeenCalled();
		});

	});

	describe('openRedirectionModal()', function() {
		it('should open', function() {
			spyOn($modal, 'open').and.returnValue(mockModal);
			$scope.openRedirectionModal(mockRace._id);
			expect($modal.open).toHaveBeenCalled();
		});
	});

	describe('openForgotPasswordModal()', function() {
		it('should open', function() {
			spyOn($modal, 'open').and.returnValue(mockModal);
			$scope.openForgotPasswordModal(mockRace._id);
			expect($modal.open).toHaveBeenCalled();
		});
	});

	describe('isLoggedIn()', function() {
		it('isLoggedIn with success', function() {
			spyOn(mockAuthService, "isLoggedIn").and.callThrough();
			$scope.isLoggedIn();
			expect(mockAuthService.isLoggedIn()).toEqual(true);
			expect(mockAuthService.isLoggedIn).toHaveBeenCalled();
		});
	});


});