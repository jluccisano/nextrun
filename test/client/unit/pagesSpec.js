'use strict';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;


var gotoPage = function(scope, location, url, onReady) {
  if (location) {
    location.path(url).replace();
    if (!scope.$$phase) {
      scope.$apply(function() {
        onReady();
      });
    } else {
      onReady();
    }
  };
};

var checkIfLoaded = function(scope, location, url, done) {
  gotoPage(scope, location, url, function() {
    scope.$watch('status', function() {
      if (scope.status == 'ready') {
        done();
      }
    });
  });
};


describe('Testing all pages to see if they load properly', function(done) {

  var rootScope, location;

  beforeEach(module('nextrunApp'));

  beforeEach(inject(function($rootScope, $location)  {
      rootScope = $rootScope;
      location = $location;
  }));


  /*it('GET /home', function(done) {
    checkIfLoaded(rootScope, location, '/', done);
  });*/
});