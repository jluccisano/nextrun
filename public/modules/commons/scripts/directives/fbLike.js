"use strict";

angular.module("nextrunApp.commons").directive("fbLike",
  function($timeout, FacebookService, $log) {
    return {
      restrict: "C",
      link: function(scope, element) {

        $timeout(function() {

          try {
            FacebookService.parseXFBML(element.parent()[0]);
          } catch (ex) {
            $log.error(ex.message);
          }
        }, 2000);

      }
    };
  });