'use strict';

describe('LoginCtrl', function() {

	var rootScope, scope, fakeAuthServices, controller, q, deferred;

	beforeEach(module('nextrunApp'));

	it('should return ', inject(function($rootScope, $controller, $location) {
		scope = $rootScope.$new();
		controller = $controller("LoginCtrl", {
			$scope: scope
		});

		scope.signup();
		expect($location.path()).toBe('/signup');
	}));



	it('Check the value returned', inject(function($controller, $q, $rootScope, $location) {
		deferred = $q.defer();

		fakeAuthServices = {
			login: function() {
				return deferred.promise;
			}
		};
		spyOn(fakeAuthServices, 'login').and.callThrough();

		rootScope = $rootScope;
		scope = $rootScope.$new();
		q = $q;
		controller = $controller('LoginCtrl', {
			$scope: scope,
			Auth: fakeAuthServices
		});

		deferred.resolve();
		$rootScope.$apply();

		scope.submit();

		expect($location.path()).toBe('/myraces');
	}));
});