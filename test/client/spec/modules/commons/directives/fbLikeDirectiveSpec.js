'use strict';

describe('Facebook plugin Directive', function() {

	var $scope, $compile, $timeout, $log, element, mockFacebookAPI;

	beforeEach(module('FacebookPluginDirectives', function($provide) {

		mockFacebookAPI = {
			parseXFBML: function() {
				return true;
			}
		}


		$provide.value('facebookAPI', mockFacebookAPI);
	}));

	beforeEach(inject(function(_$compile_, _$rootScope_, _$timeout_, _$log_) {
		$compile = _$compile_;
		$scope = _$rootScope_.$new();
		$timeout = _$timeout_;
		$log = _$log_;
	}));

	beforeEach(function() {
		element = angular.element("<div class='fb-like' data-href='http://www.nextrun.fr/races/view/12345' data-layout='button_count' data-action='like' data-show-faces='true' data-share='false'/>");
		$compile(element)($scope);
	});

	describe('Facebook like button reload', function() {

		it('should reload Facebook plugin successfully', function() {
			spyOn(mockFacebookAPI, 'parseXFBML').and.callThrough();
			$scope.$digest();
			$timeout.flush();
			expect(mockFacebookAPI.parseXFBML).toHaveBeenCalled();
		});

		it('should throw error when FB is undefined', function() {
			spyOn(mockFacebookAPI, 'parseXFBML').and.throwError('error');
			spyOn($log, "error");
			$scope.$digest();
			$timeout.flush();
			expect($log.error).toHaveBeenCalledWith('error');
		});

	});
});