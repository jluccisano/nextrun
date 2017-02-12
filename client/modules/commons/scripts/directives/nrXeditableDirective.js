angular.module('xeditable').directive('nrEditableBsdate', ['editableDirectiveFactory',
  function(editableDirectiveFactory) {
    return editableDirectiveFactory({
      directiveName: 'nrEditableBsdate',
      inputTpl:' <input type="text" class="form-control"  bs-datepicker>',
    });
}]);

angular.module('xeditable').directive('nrEditableBstime', ['editableDirectiveFactory',
  function(editableDirectiveFactory) {
    return editableDirectiveFactory({
      directiveName: 'nrEditableBstime',
      inputTpl: '<input type="text" bs-timepicker>'
    });
}]);