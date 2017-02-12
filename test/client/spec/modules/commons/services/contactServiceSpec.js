describe('ContactService', function() {

	var $httpBackend, ContactService, mockContact, mockFeedback, mockRestAPIHelper;

	beforeEach(module('nextrunApp.commons', function($provide) {
		mockRestAPIHelper = jasmine.createSpyObj('RestAPIHelper', ['sendPOST', 'sendGET', 'sendDELETE', 'sendPUT']);
		$provide.value('RestAPIHelper', mockRestAPIHelper);
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
			expect(mockRestAPIHelper.sendPOST).toHaveBeenCalledWith('/api/contacts', mockContact);
		});
	});

	describe('sendFeedback', function() {
		it('should call sendPOST with success', function() {
			ContactService.sendFeedback(mockFeedback);
			expect(mockRestAPIHelper.sendPOST).toHaveBeenCalledWith('/api/contacts/feedback', mockFeedback);
		});
	});

});