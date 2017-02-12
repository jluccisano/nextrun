"use strict";

/**
 * Checklist-model
 * AngularJS directive for list of checkboxes
 */
angular.module("nextrunApp.commons").directive("nrChecklistModel", function($parse, $compile) {
  //FIXME replace by ui-select
  // contains
  function contains(arr, item) {
    if (angular.isArray(arr)) {
      for (var i = 0; i < arr.length; i++) {
        if (angular.equals(arr[i], item)) {
          return true;
        }
      }
    }
    return false;
  }

  // add
  function add(arr, item) {
    arr = angular.isArray(arr) ? arr : [];
    for (var i = 0; i < arr.length; i++) {
      if (angular.equals(arr[i], item)) {
        return arr;
      }
    }
    arr.push(item);
    return arr;
  }

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

  // http://stackoverflow.com/a/19228302/1458162
  function postLinkFn(scope, elem, attrs) {
    // compile with `ng-model` pointing to `checked`
    $compile(elem)(scope);

    // getter / setter for original model
    var getter = $parse(attrs.checklistModel);
    var setter = getter.assign;

    // value added to list
    var getValue = $parse(attrs.checklistValue);

    // watch UI checked change
    scope.$watch("checked", function(newValue, oldValue) {
      if (newValue === oldValue) {
        return;
      }
      var current = getter(scope.$parent);
      var value = getValue(scope.$parent);

      if (newValue === true) {
        setter(scope.$parent, add(current, value));
      } else {
        setter(scope.$parent, remove(current, value));
      }
      scope.$eval(attrs.checklistChange);
    });

    // watch original model change
    scope.$parent.$watch(attrs.checklistModel, function(newArr) {
      scope.checked = contains(newArr, getValue(scope.$parent));
    }, true);


  }

  return {
    restrict: "A",
    priority: 1000,
    terminal: true,
    scope: true,
    compile: function(tElement, tAttrs) {

      if (tElement[0].tagName !== "input" || !tElement.attr("type", "checkbox")) {
        throw "checklist-model should be applied to input[type=checkbox].";
      }

      if (!tAttrs.checklistValue) {
        throw "You should provide 'checklist-value'.";
      }

      // exclude recursion
      tElement.removeAttr("checklist-model");

      // local scope var storing individual checkbox model
      tElement.attr("ng-model", "checked");

      return postLinkFn;
    }
  };
});