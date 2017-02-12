'use strict';

describe('tag list Directive', function() {

	var $scope, $compile, element;

	beforeEach(module('nextrunApp.commons'));

	beforeEach(inject(function(_$compile_, _$rootScope_) {
		$compile = _$compile_;
		$scope = _$rootScope_.$new();
	}));

	describe('tagListModel', function() {

		beforeEach(function() {
			element = angular.element("<span taglist-model='types' taglist-value='type' taglist-change='search()'/>");
			$compile(element)($scope);
		});

		it('should remove element of list', function() {
			$scope.types = ["running", "trail"];
			$scope.type = "trail";
			$scope.$digest();
			element.triggerHandler("click");
			expect($scope.types.length).toBe(2);
		});
	});
});