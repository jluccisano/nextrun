'use strict';

describe('Test settings scenario', function() {

  var ptor = protractor.getInstance();

  var settingsURL = '/users/settings';

  var username = element(by.name('form1')).$('input[name=username]');
  var email = element(by.name('form1')).$('input[name=email]');
  var submitChangeProfile = element(by.name('form1')).$('button[name=submit]');

  beforeEach(function() {
    browser.get(settingsURL);
    expect(browser.getCurrentUrl()).toEqual('http://localhost:4000/users/settings');
  });

  it('should keep invalid change profile', function() {

    username.clear();
    email.clear();

    username.sendKeys('ed');
    expect(element(by.name('username-minLength')).isDisplayed()).toBe(true);

    username.sendKeys('edfdlmfjlsdjflksdflsdjflksdjflsdjflsdjflsjdlfjsdlfsdlfjlsdfjlsdjflsdjflsdfjsdlfj');
    expect(element(by.name('username-maxLength')).isDisplayed()).toBe(true);

    email.sendKeys('toto');
    expect(element(by.name('email-invalid')).isDisplayed()).toBe(true);

  });

  it('ensures change profile', function() {

    username.clear();
    email.clear();

    username.sendKeys('Foo2 Bar');
    email.sendKeys('foo2@bar.com');

    submitChangeProfile.click();

  });

});