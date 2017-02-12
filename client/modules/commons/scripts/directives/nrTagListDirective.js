"use strict";

/**
 * Taglist-model
 * AngularJS directive for list of checkboxes
 */
angular.module("nextrunApp.commons").directive("nrTaglistModel",
  function($parse) {

    // remove
    function remove(arr, item) {
      if (angular.isArray(arr)) {
        for (var i = 0; i < arr.length; i++) {
          if (angular.equals(arr[i], item)) {
            arr.splice(i, 1);
            break;
          }
        }
      }
      return arr;
    }

    function postLinkFn(scope, elem, attrs) {
      
      // getter / setter for original model
      var getter = $parse(attrs.taglistModel);
      var setter = getter.assign;

      // value added to list
      var getValue = $parse(attrs.taglistValue);

      elem.bind("click", function() {
        
        var current = getter(scope.$parent);
        var value = getValue(scope.$parent);

        if(value) {
          setter(scope.$parent, remove(current, value));
        }
        
        
        scope.$eval(attrs.taglistChange);
      });
    }

    return {
      restrict: "A",
      priority: 1000,
      terminal: true,
      scope: true,
      compile: function() {
        return postLinkFn;
      }
    };
  });