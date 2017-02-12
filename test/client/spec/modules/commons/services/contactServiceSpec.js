describe('ContactService', function() {

	var $httpBackend, ContactService, mockContact, mockFeedback, mockHttpUtils;

	beforeEach(module('nextrunApp.commons', function($provide) {
		mockHttpUtils = jasmine.createSpyObj('HttpUtils', ['post', 'get', 'delete', 'put']);
		$provide.value('HttpUtils', mockHttpUtils);
	}));

	beforeEach(inject(function(_ContactService_) {
		ContactService = _ContactService_;

		mockContact = {
			email: "foo@bar.com",
			type: "athlete"
		}

		mockFeedback = {
			email: "foo@bar.com",
			message: "message"
		}
	}));

	describe('addContact', function() {
		it('should call sendPOST with success', function() {
			ContactService.addContact(mockContact);
			expect(mockHttpUtils.post).toHaveBeenCalledWith('/api/contacts', mockContact);
		});
	});

	describe('sendFeedback', function() {
		it('should call sendPOST with success', function() {
			ContactService.sendFeedback(mockFeedback);
			expect(mockHttpUtils.post).toHaveBeenCalledWith('/api/contacts/feedback', mockFeedback);
		});
	});

});