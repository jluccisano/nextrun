'use strict';

describe('addHTTP Directive', function() {

	var $scope, $compile, element;

	beforeEach(module('addHttp'));

	beforeEach(inject(function(_$compile_, _$rootScope_) {
		$compile = _$compile_;
		$scope = _$rootScope_.$new();
	}));

	beforeEach(function() {
		element = angular.element("<a ng-href='{{url}}' add-http target='_blank'/>")
		$compile(element)($scope);
	});

	describe('addHttp', function() {

		it('should return a invalid http', function() {
			$scope.url = undefined;
			$scope.$digest();
			expect(element.attr('href')).toBe(undefined);
		});

		it('should return a valid http', function() {
			$scope.url = "http://www.nextrun.fr";
			$scope.$digest();
			expect(element.attr('href')).toEqual("http://www.nextrun.fr");

			$scope.url = "www.nextrun.fr";
			$scope.$digest();
			expect(element.attr('href')).toEqual("http://www.nextrun.fr");
		});

	});
});