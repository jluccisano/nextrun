describe('AuthServices', function() {

	var $q, AuthServices, mockUser, mockRestAPIHelper;

	beforeEach(module('mockModule'));

	beforeEach(function() {

		module('restAPI', function($provide) {


			mockRestAPIHelper = {
				sendPOST: function(url, data) {

				},
				sendGET: function(url) {

				},
				sendDELETE: function(url) {

				},
				sendPUT: function(url, data) {

				}
			}


			spyOn(mockRestAPIHelper, "sendGET").and.callThrough();
			spyOn(mockRestAPIHelper, "sendDELETE").and.callThrough();
			spyOn(mockRestAPIHelper, "sendPUT").and.callThrough();

			$provide.value('RestAPIHelper', mockRestAPIHelper);

		});

		inject(function(_AuthServices_, _MockFactory_, _$q_) {
			AuthServices = _AuthServices_;
			mockUser = _MockFactory_.getMockUser();
			$q = _$q_;
		});



	});

	/*beforeEach(module('restAPI', function($provide) {
		//mockRestAPIHelper = jasmine.createSpyObj('RestAPIHelper', ['sendPOST', 'sendGET', 'sendDELETE', 'sendPUT']);

		mockRestAPIHelper = {
			sendPOST: function(url, data) {
				var deferred = $q.defer();
				deferred.resolve();
				return deferred.promise;
			},
			sendGET: function(url) {
				var deferred = $q.defer();
				deferred.resolve();
				return deferred.promise;
			},
			sendDELETE: function(url) {
				var deferred = $q.defer();
				deferred.resolve();
				return deferred.promise;
			},
			sendPUT: function(url, data) {
				var deferred = $q.defer();
				deferred.resolve();
				return deferred.promise;
			}
		}

		spyOn(mockRestAPIHelper, "sendPOST").and.callThrough();
		spyOn(mockRestAPIHelper, "sendGET").and.callThrough();
		spyOn(mockRestAPIHelper, "sendDELETE").and.callThrough();
		spyOn(mockRestAPIHelper, "sendPUT").and.callThrough();

		$provide.value('RestAPIHelper', mockRestAPIHelper);
	}));*/

	/*beforeEach(inject(function(_AuthServices_, _MockFactory_) {
		AuthServices = _AuthServices_;
		mockUser = _MockFactory_.getMockUser();
	}));*/

	describe('register', function() {
		it('should call sendPOST with success', function() {
			spyOn(mockRestAPIHelper, "sendPOST").and.callThrough();
			AuthServices.register(mockUser);
			expect(mockRestAPIHelper.sendPOST).toHaveBeenCalledWith('/api/users/signup', mockUser);
		});
	});

	describe('forgotPassword', function() {
		it('should call sendPOST with success', function() {
			spyOn(mockRestAPIHelper, "sendPOST").and.callThrough();
			AuthServices.forgotPassword(mockUser);
			expect(mockRestAPIHelper.sendPOST).toHaveBeenCalledWith('/api/users/forgotpassword', mockUser);
		});
	});

	describe('checkEmail', function() {
		it('should call sendPOST with success', function() {
			spyOn(mockRestAPIHelper, "sendPOST").and.callThrough();
			AuthServices.checkEmail(mockUser);
			expect(mockRestAPIHelper.sendPOST).toHaveBeenCalledWith('/api/users/check/email', mockUser);
		});
	});

	describe('updateProfile', function() {
		it('should call sendPUT with success', function() {
			AuthServices.updateProfile(mockUser);
			expect(mockRestAPIHelper.sendPUT).toHaveBeenCalledWith('/api/users/update/profile', mockUser);
		});
	});

	describe('updatePassword', function() {
		it('should call sendPUT with success', function() {
			AuthServices.updatePassword(mockUser);
			expect(mockRestAPIHelper.sendPUT).toHaveBeenCalledWith('/api/users/update/password', mockUser);
		});
	});

	describe('getUserProfile', function() {
		it('should call sendGET with success', function() {
			AuthServices.getUserProfile();
			expect(mockRestAPIHelper.sendGET).toHaveBeenCalledWith('/api/users/settings');
		});
	});

	describe('logout', function() {
		it('should call sendGET with success', function() {

			var deferred = $q.defer();

			spyOn(mockRestAPIHelper, "sendPOST").and.callFake(function() {
				return deferred.promise;
			})
			AuthServices.logout();

			deferred.resolve();

			expect(mockRestAPIHelper.sendPOST).toHaveBeenCalledWith('/api/users/logout', undefined);
		});
	});

});