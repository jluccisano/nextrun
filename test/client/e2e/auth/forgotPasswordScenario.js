'use strict';

describe('Test forgot password scenario', function() {

  var loginURL = '/login';

  var email = element(by.name('forgotPasswordform')).$('input[name=email]');
  var submit = element(by.name('forgotPasswordform')).$('button[name=submit]');
  var forgotPasswordButton = element(by.name('forgotPassword'));

  beforeEach(function() {
    browser.get(loginURL);
    expect(browser.getCurrentUrl()).toEqual('http://localhost:4000/login');
    forgotPasswordButton.click();
  });

  it('should keep invalid forgotPassword form on this page', function() {
    email.sendKeys('toto');
    expect(element(by.name('forgotPasswordform')).$('span[name=email-invalid]').isDisplayed()).toBe(true);
  });

  it('ensures forgotPassword form is valid', function() {

    email.clear();

    email.sendKeys('foo@bar.com');
    submit.click();

    expect(browser.getCurrentUrl()).toEqual('http://localhost:4000/login');

  });
});