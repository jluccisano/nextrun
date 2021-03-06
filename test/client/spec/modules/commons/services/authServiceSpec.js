describe('AuthService', function() {

	var $q, AuthService, mockUser, mockHttpUtils;

	beforeEach(module('mockModule'));

	beforeEach(function() {

		module('nextrunApp.commons', function($provide) {


			mockHttpUtils = {
				post: function(url, data) {

				},
				get: function(url) {

				},
				delete: function(url) {

				},
				put: function(url, data) {

				}
			}


			spyOn(mockHttpUtils, "get").and.callThrough();
			spyOn(mockHttpUtils, "delete").and.callThrough();
			spyOn(mockHttpUtils, "put").and.callThrough();

			$provide.value('HttpUtils', mockHttpUtils);

		});

		inject(function(_AuthService_, _MockFactory_, _$q_) {
			AuthService = _AuthService_;
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

	/*beforeEach(inject(function(_AuthService_, _MockFactory_) {
		AuthService = _AuthService_;
		mockUser = _MockFactory_.getMockUser();
	}));*/

	/*describe('register', function() {
		it('should call sendPOST with success', function() {
			spyOn(mockRestAPIHelper, "sendPOST").and.callThrough();
			AuthService.register(mockUser);
			expect(mockRestAPIHelper.sendPOST).toHaveBeenCalledWith('/api/users/signup', mockUser);
		});
	});*/

	describe('forgotPassword', function() {
		it('should call sendPOST with success', function() {
			spyOn(mockHttpUtils, "post").and.callThrough();
			AuthService.forgotPassword(mockUser);
			expect(mockHttpUtils.post).toHaveBeenCalledWith('/api/users/forgotpassword', mockUser);
		});
	});

	describe('checkEmail', function() {
		it('should call sendPOST with success', function() {
			spyOn(mockHttpUtils, "post").and.callThrough();
			AuthService.checkEmail(mockUser);
			expect(mockHttpUtils.post).toHaveBeenCalledWith('/api/users/check/email', mockUser);
		});
	});

	describe('updateProfile', function() {
		it('should call sendPUT with success', function() {
			AuthService.updateProfile(mockUser);
			expect(mockHttpUtils.put).toHaveBeenCalledWith('/api/users/update/profile', mockUser);
		});
	});

	describe('updatePassword', function() {
		it('should call sendPUT with success', function() {
			AuthService.updatePassword(mockUser);
			expect(mockHttpUtils.put).toHaveBeenCalledWith('/api/users/update/password', mockUser);
		});
	});

	describe('getUserProfile', function() {
		it('should call sendGET with success', function() {
			AuthService.getUserProfile();
			expect(mockHttpUtils.get).toHaveBeenCalledWith('/api/users/settings');
		});
	});

	describe('logout', function() {
		it('should call sendGET with success', function() {

			var deferred = $q.defer();

			spyOn(mockHttpUtils, "post").and.callFake(function() {
				return deferred.promise;
			})
			AuthService.logout();

			deferred.resolve();

			expect(mockHttpUtils.post).toHaveBeenCalledWith('/api/users/logout', undefined);
		});
	});

});