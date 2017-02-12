describe('hasLocation', function() {

	var $scope, $compile, element, form,mockRace;

	beforeEach(module('hasLocation', 'mockModule'));

	beforeEach(inject(function(_$compile_, _$rootScope_, _MockFactory_) {
		$compile = _$compile_;
		$scope = _$rootScope_.$new();
		mockRace = _MockFactory_.getMockRace();
	}));

	var template = '<form name="form">' +
		'<input class="form-control" name="location" ng-model="race.pin.name" has-location details="race.pin">' +
		'</form>';

	beforeEach(inject(function(_$compile_, _$rootScope_) {
		element = angular.element(template);
		$compile(element)($scope);
		form = $scope.form;
	}));

	it('should has location', function() {
		$scope.race = mockRace;
		$scope.$digest();
		expect(form.location.$valid).toBe(true);
		expect(form.location.$error.validLocation).toBe(false);

	});

	it("should hasn't location", function() {
		$scope.race = {};
		$scope.$digest();
		expect(form.location.$valid).toBe(false);
		expect(form.location.$error.validLocation).toBe(true);

	});
});