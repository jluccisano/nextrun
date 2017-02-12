describe('ContactServices', function() {

	var $httpBackend, ContactServices, mockContact, mockFeedback, mockRestAPIHelper;

	beforeEach(module('restAPI', function($provide) {
		mockRestAPIHelper = jasmine.createSpyObj('RestAPIHelper', ['sendPOST', 'sendGET', 'sendDELETE', 'sendPUT']);
		$provide.value('RestAPIHelper', mockRestAPIHelper);
	}));

	beforeEach(inject(function(_ContactServices_) {
		ContactServices = _ContactServices_;

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
			ContactServices.addContact(mockContact);
			expect(mockRestAPIHelper.sendPOST).toHaveBeenCalledWith('/api/contacts', mockContact);
		});
	});

	describe('sendFeedback', function() {
		it('should call sendPOST with success', function() {
			ContactServices.sendFeedback(mockFeedback);
			expect(mockRestAPIHelper.sendPOST).toHaveBeenCalledWith('/api/contacts/feedback', mockFeedback);
		});
	});

});