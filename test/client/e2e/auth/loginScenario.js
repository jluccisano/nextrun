'use strict';

describe('Test login scenario', function() {

  var loginURL = '/login';

  var email = element(by.name('email'));
  var password = element(by.name('password'));
  var submitButton = element(by.name('submit'));

  beforeEach(function() {
    browser.get(loginURL);
    expect(browser.getCurrentUrl()).toEqual('http://localhost:4000/login');
  });

  it('should keep invalid logins on this page', function() {

    email.clear();
    password.clear();

    element(by.name('email')).sendKeys('toto');
    expect(element(by.name('email-invalid')).isDisplayed()).toBe(true);


  });

  it('ensures user can log in', function() {

    email.clear();
    password.clear();

    email.sendKeys('foo@bar.com');
    password.sendKeys('1234');
    submitButton.click();

    expect(browser.getCurrentUrl()).not.toEqual('http://localhost:4000/myraces');

  });


});