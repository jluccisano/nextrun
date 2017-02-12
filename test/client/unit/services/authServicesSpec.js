'use strict';

describe('authServices', function() {
	var Auth;
	var $httpBackend;

	beforeEach(function() {
		module('nextrunApp');
	});

	beforeEach(inject(function($injector) {
		$httpBackend = $injector.get('$httpBackend');
		Auth = $injector.get('Auth');
	}));

/*
	describe('login', function() {
		it('should make a request and invoke callback', function() {
			var invoked = false;
			var success = function() {
				invoked = true;
			};
			var error = function() {};
			$httpBackend.expectPOST('/api/users/session').respond();
			Auth.login({}, success, error);
			$httpBackend.flush();
			expect(invoked).toEqual(true);
		});

		it('should append the user', function() {
			var success = function() {};
			var error = function() {};
			$httpBackend.expectPOST('/api/users/session').respond({
				id: '1',
				email: 'foo@bar.com',
				username: 'foo',
				role: {
					bitMask: 1,
					title: 'public'
				}
			});
			Auth.login({}, success, error);
			$httpBackend.flush();
			expect(Auth.user).toEqual({
				id: '1',
				email: 'foo@bar.com',
				username: 'foo',
				role: {
					bitMask: 1,
					title: 'public'
				}
			});
		});
	});
*/
	describe('logout', function() {
		it('should make a request and invoke callback', function() {
			var invoked = false;
			var success = function() {
				invoked = true;
			};
			var error = function() {};
			$httpBackend.expectPOST('/api/users/logout').respond();
			Auth.logout(success, error);
			$httpBackend.flush();
			expect(invoked).toBe(true);
		});
	});

});