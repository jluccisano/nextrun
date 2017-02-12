'use strict';

describe('multiselect Directive', function() {

	var $scope, $compile, element;

	beforeEach(module('nextrunApp.commons'));

	beforeEach(inject(function(_$compile_, _$rootScope_) {
		$compile = _$compile_;
		$scope = _$rootScope_.$new();
	}));

	beforeEach(function() {
		element = angular.element("<select class='multiselect' ng-model='currentSelected' multiple='multiple' multiselect-dropdown>" +
			"<option value='0'>Valeur 1</option>" +
			"<option value='1'>Valeur 2</option>" +
			"<option value='2'>Valeur 3</option>" +
			"</select>");
		$compile(element)($scope);
	});

	describe('multiselect', function() {

		it('should return', function() {
			$scope.$digest();
		});
	});
});