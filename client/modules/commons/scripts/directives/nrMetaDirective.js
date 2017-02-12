"use strict";

angular.module("nextrunApp.commons").directive("nrMeta", function() {
  return {
    restrict: "E",
    template: '<meta content="{{nrContent}}"></meta>',
    replace: true,
    scope: {
      nrContent: "=nrContent"
    },
    link: function(scope, element, attrs, ctrl) {

    }
  };
});