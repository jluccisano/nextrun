describe('RestAPIHelper', function() {

	var $httpBackend, RestAPIHelper, response, mockResult, mockData, mockError;

	beforeEach(module('nextrunApp.commons'));

	beforeEach(inject(function(_$httpBackend_, _RestAPIHelper_) {
		$httpBackend = _$httpBackend_;
		RestAPIHelper = _RestAPIHelper_;

		mockData = {
			name: 'foo',
			email: 'foo@bar.com'
		};

		mockError = {
			message: ["error1","error2"]
		};
	}));

	describe('sendGET', function() {
		beforeEach(function() {
			RestAPIHelper.sendGET('/some/url').then(function(result) {
				response = result;
			}, function(reason) {
				response = reason;
			});
		});

		it('should make a request and invoke callback success', function() {
			$httpBackend.expectGET('/some/url').respond(200, mockData);
			$httpBackend.flush();
			expect(response).toEqual(mockData);
		});

		it('should make a request and invoke callback error', function() {
			$httpBackend.expectGET('/some/url').respond(400, mockError);
			$httpBackend.flush();
			expect(response).toEqual(mockError);
		});
	});

	describe('sendPUT', function() {
		beforeEach(function() {
			RestAPIHelper.sendPUT('/some/url', mockData).then(function(result) {
				response = result;
			}, function(reason) {
				response = reason;
			});
		});

		it('should make a request and invoke callback success', function() {
			$httpBackend.expectPUT('/some/url').respond(200, mockData);
			$httpBackend.flush();
			expect(response).toEqual(mockData);
		});

		it('should make a request and invoke callback error', function() {
			$httpBackend.expectPUT('/some/url').respond(400, mockError);
			$httpBackend.flush();
			expect(response).toEqual(mockError);
		});
	});

	describe('sendPOST', function() {
		beforeEach(function() {
			RestAPIHelper.sendPOST('/some/url', mockData).then(function(result) {
				response = result;
			}, function(reason) {
				response = reason;
			});
		});

		it('should make a request and invoke callback success', function() {
			$httpBackend.expectPOST('/some/url').respond(200, mockData);
			$httpBackend.flush();
			expect(response).toEqual(mockData);
		});

		it('should make a request and invoke callback error', function() {
			$httpBackend.expectPOST('/some/url').respond(400, mockError);
			$httpBackend.flush();
			expect(response).toEqual(mockError);
		});
	});

	describe('sendDELETE', function() {
		beforeEach(function() {
			RestAPIHelper.sendDELETE('/some/url').then(function(result) {
				response = result;
			}, function(reason) {
				response = reason;
			});
		});

		it('should make a request and invoke callback success', function() {
			$httpBackend.expectDELETE('/some/url').respond(200, mockData);
			$httpBackend.flush();
			expect(response).toEqual(mockData);
		});

		it('should make a request and invoke callback error', function() {
			$httpBackend.expectDELETE('/some/url').respond(400, mockError);
			$httpBackend.flush();
			expect(response).toEqual(mockError);
		});
	});

});