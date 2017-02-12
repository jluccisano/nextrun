"use strict";

describe("check list Directive", function() {

	var $scope, $compile, element;

	beforeEach(module("nextrunApp.commons"));

	beforeEach(inject(function(_$compile_, _$rootScope_) {
		$compile = _$compile_;
		$scope = _$rootScope_.$new();
	}));

	describe("checklistModel invalid parameters", function() {

		/*it("should return an error when the checklist-value is not set", function() {
			function errorFunctionWrapper() {
				$compile(angular.element("<input type='checkbox' checklist-change='search()'' checklist-model='model'/>"))($scope);
				$scope.$digest();
			}
			expect(errorFunctionWrapper).toThrow();
		});*/

		/*it("should return an error when element is not an input type checkbox", function() {
			function errorFunctionWrapper() {

				$scope.model = {};

				$compile(angular.element("<button ng-model='model' checklist-change='search()' checklist-model='model'><button/>"))($scope);
				$scope.$digest();
			}
			expect(errorFunctionWrapper).toThrow();
		});*/
		
	});

	describe("checklistModel", function() {

		beforeEach(function() {

			$scope.model = {};

			element = angular.element("<input type='checkbox'" +
				"checklist-change='search()' ng-model='model'" +
				"checklist-model='model'" +
				"checklist-value='value'/>");
			$compile(element)($scope);
		});

		/*it("should add and remove element of list", function() {
			$scope.$digest();
			element.scope().$digest();
			element.scope().checked = true;
			element.scope().$digest();
			expect($scope.model.length).toBe(1);
			element.scope().checked = false;
			element.scope().$digest();
			expect($scope.model.length).toBe(0);
		});

		it("should add and remove element of list with a list ", function() {
			element.scope().$digest();
			$scope.model = ["duathlon"];
			$scope.value = "duathlon";
			$scope.$digest();

			element.scope().checked = true;
			element.scope().$digest();
		});*/

	});
});