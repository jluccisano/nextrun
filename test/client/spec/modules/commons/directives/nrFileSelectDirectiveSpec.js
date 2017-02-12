describe('file select directive', function() {

	var $scope, $compile, element, form;

	beforeEach(module('nextrunApp.commons'));

	beforeEach(inject(function(_$compile_, _$rootScope_) {
		$compile = _$compile_;
		$scope = _$rootScope_.$new();
	}));

	var template =  '<input type="file" ng-model="$files" nr-file-select="onFileSelect($files, route)")>';

	beforeEach(inject(function(_$compile_, _$rootScope_) {
		element = angular.element(template);
		$compile(element)($scope);
	}));

	it('should call get file when change event is triggered', function() {

		$scope.getFile = function() {
			return true;
		}
		spyOn($scope,"getFile");
		element.triggerHandler('change');
		expect($scope.getFile).toHaveBeenCalled();
	});
});