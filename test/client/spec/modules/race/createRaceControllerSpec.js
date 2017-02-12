'use strict';

describe('MyRacesController', function() {

	var $scope, $controller, $location, $q, $modal, mockRaceServices, mockRace, mockModal, mockAlert, mockAuthServices, mockUser, metaBuilder;

	beforeEach(module('nextrunApp.race', 'mockModule'));

	beforeEach(inject(function(_$rootScope_, _$controller_, _$q_, _$location_, _$modal_, _Alert_,_MockFactory_, _metaBuilder_) {
		$scope = _$rootScope_.$new();
		$controller = _$controller_;
		$q = _$q_;
		$location = _$location_;
		metaBuilder = _metaBuilder_;
		$modal = _$modal_;
		mockAlert = _Alert_;
		mockUser = _MockFactory_.getMockUser();
		mockRace = _MockFactory_.getMockRace();
		mockModal = _MockFactory_.getMockModalServices();
		mockRaceServices = _MockFactory_.getMockRaceServices();
		mockAuthServices = _MockFactory_.getMockAuthServices();

		spyOn(metaBuilder, "ready");

		$controller('CreateRaceController', {
			$scope: $scope,
			RaceServices: mockRaceServices,
			AuthServices: mockAuthServices,
			Alert: mockAlert
		});


		expect(metaBuilder.ready).toHaveBeenCalled();

	}));

	describe('submit()', function() {

		it('submit with success when user isLoggedIn', function() {
			mockRaceServices.setPromiseResponse(true);

			$scope.race = mockRace;

			spyOn($scope, "isLoggedIn").and.returnValue(true);
			spyOn(mockAlert, "add");
			spyOn($scope, "openRedirectionModal");
			spyOn(mockRaceServices, "create").and.callThrough();

			$scope.submit();
			$scope.$apply();

			expect(mockAlert.add).toHaveBeenCalledWith("success", "message.create.successfully", 3000);
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
			mockAuthServices.setPromiseResponse(true);


			spyOn(mockAuthServices, "register").and.callThrough();
			spyOn($scope, "submit");

			$scope.signup();
			$scope.$apply();

			expect($scope.submit).toHaveBeenCalled();
		});

	});

	describe('login()', function() {

		it('signup with success', function() {
			mockAuthServices.setPromiseResponse(true);
			$scope.user = mockUser;

			spyOn(mockAuthServices, "login").and.callThrough();
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
			spyOn(mockAuthServices, "isLoggedIn").and.callThrough();
			$scope.isLoggedIn();
			expect(mockAuthServices.isLoggedIn()).toEqual(true);
			expect(mockAuthServices.isLoggedIn).toHaveBeenCalled();
		});
	});


});