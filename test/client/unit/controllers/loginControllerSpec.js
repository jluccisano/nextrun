'use strict';

describe('LoginCtrl', function() {

	beforeEach(module('nextrunApp'));

	it('signup() should redirect to /signup view', inject(function($rootScope, $controller, $location) {
		var scope = $rootScope.$new();
		var controller = $controller("LoginCtrl", {
			$scope: scope
		});

		scope.signup();
		expect($location.path()).toBe('/signup');
	}));

	it('submit() with success change location to /myraces', inject(function($rootScope, $controller, $location) {

		var scope = $rootScope.$new();

		var fakeAuthServices = {
			login: function(user, success, error) {
				return success();
			}
		};

		var controller = $controller('LoginCtrl', {
			$scope: scope,
			Auth: fakeAuthServices
		});

		spyOn(fakeAuthServices, "login").and.callThrough();

		scope.submit();

		expect($location.path()).toBe('/myraces');
	}));

	it('submit() with error show alert message', inject(function($rootScope, $controller, $location) {

		var scope = $rootScope.$new();

		var errorMsg = {
			message: ["error"]
		};

		var fakeAuthServices = {
			login: function(user, success, error) {
				return error(errorMsg);
			}
		};

		var fakeAlertServices = {
			add: function(type, msg, timeout) {
				//nothing
			}
		}

		var controller = $controller('LoginCtrl', {
			$scope: scope,
			Auth: fakeAuthServices,
			Alert: fakeAlertServices
		});

		spyOn(fakeAuthServices, "login").and.callThrough();
		spyOn(fakeAlertServices, "add").and.callThrough();

		scope.submit();

		expect(fakeAlertServices.add).toHaveBeenCalledWith("danger", errorMsg.message[0], 3000);
	}));
});