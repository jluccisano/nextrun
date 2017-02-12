'use strict';

describe('Test Login scenario', function() {

	beforeEach(function() {
		browser().navigateTo('/login');
		
	});

	it('ensures user can log in', function() { 

		expect(browser().location().path()).toBe("/login");

		// assuming inputs have ng-model specified, and this conbination will successfully login
		//input('email').enter('test@test.com');
		//input('password').enter('password');
		//element('submit').click();

		// logged in route
		//expect(browser().location().path()).toBe("/myraces");

		// my dashboard page has a label for the email address of the logged in user
		//expect(element('#email').html()).toContain('test@test.com');
	});

});