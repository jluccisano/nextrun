'use strict';

describe('Test signup scenario', function() {

  var signupURL = '/signup';

  var username = element(by.name('username'));
  var email = element(by.name('email'));
  var password = element(by.name('password'));
  var confirmPassword = element(by.name('confirmPassword'));
  var submitButton = element(by.name('submit'));

  beforeEach(function() {
    browser.get(signupURL);
    expect(browser.getCurrentUrl()).toEqual('http://localhost:4000/signup');
  });

  it('should keep invalid logins on this page', function() {

    username.clear();
    email.clear();
    password.clear();
    confirmPassword.clear();

    username.sendKeys('ed');
    expect(element(by.name('username-minLength')).isDisplayed()).toBe(true);

    username.sendKeys('edfdlmfjlsdjflksdflsdjflksdjflsdjflsdjflsjdlfjsdlfsdlfjlsdfjlsdjflsdjflsdfjsdlfj');
    expect(element(by.name('username-maxLength')).isDisplayed()).toBe(true);

    email.sendKeys('toto');
    expect(element(by.name('email-invalid')).isDisplayed()).toBe(true);

    password.sendKeys('12');
    expect(element(by.name('password-minLength')).isDisplayed()).toBe(true);

    password.sendKeys('1298797dsdsdsggd78dfdf');
    expect(element(by.name('password-maxLength')).isDisplayed()).toBe(true);

    confirmPassword.sendKeys('differentPassword');
    expect(element(by.name('confirmPassword-match')).isDisplayed()).toBe(true);

  });

  it('ensures user can sign up', function() {

    username.clear();
    email.clear();
    password.clear();
    confirmPassword.clear();

    username.sendKeys('Foo Bar');
    email.sendKeys('foo@bar.com');
    password.sendKeys('12345');
    confirmPassword.sendKeys('12345');
    submitButton.click();

    expect(browser.getCurrentUrl()).toEqual('http://localhost:4000/');


  });

  it('ensures email already exists', function() {

    username.clear();
    email.clear();
    password.clear();
    confirmPassword.clear();

    username.sendKeys('Foo Bar');
    email.sendKeys('foo@bar.com');
    password.sendKeys('1234');
    confirmPassword.sendKeys('1234');
    submitButton.click();

    //var firstRepeat = element(by.repeater('alert in alerts').row(0));

    //expect(firstRepeat.findElement(by.model('alert.msg')).getText()).toBe('408 555 1212');

    //expect(firstRepeat).toEqual('Félicitation! votre inscription a été validé');


    expect(browser.getCurrentUrl()).toEqual('http://localhost:4000/signup');

  });

});