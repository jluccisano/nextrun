"use strict";

angular.module("nextrunApp.commons").directive("nrAddHttp", function() {
  return {
    restrict: "A",
    priority: 100, //priority > to ngHref directive
    link: function(scope, element, attr) {
      //observe element {{bind}}
      attr.$observe("ngHref", function(value) {
        if (!value) {
            return;
        }
        if (!value.match(/^[a-zA-Z]+:\/\//)) {
          value = "http://" + value;
        }
        attr.$set("href", value);

      });
    }
  };
});