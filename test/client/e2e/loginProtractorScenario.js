'use strict';

describe('Test login scenario', function() {

  var loginURL = '/login';

  var email = element(by.name('email'));
  var password = element(by.name('password'));
  var submitButton = element(by.buttonText('Se connecter'));

  beforeEach(function() {
    browser.get(loginURL);
    expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/login');
  });

  it('should keep invalid logins on this page', function() {

    email.clear();
    password.clear();

    element(by.name('email')).sendKeys('toto');
    expect(element(by.name('email-invalid')).getText()).toMatch('Email invalide');


  });

  it('ensures user can log in', function() {

    email.clear();
    password.clear();

    email.sendKeys('joseph.luccisano@gmail.com');
    password.sendKeys('011004');
    submitButton.click();

    expect(browser.getCurrentUrl()).not.toEqual('/myraces');

  });


});