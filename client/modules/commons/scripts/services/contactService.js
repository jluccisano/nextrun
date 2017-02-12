"use strict";

angular.module("nextrunApp.commons").factory("ContactService",
	function(RestAPIHelper) {
		
		return {
			addContact: function(contact) {
				return RestAPIHelper.sendPOST("/api/contacts", contact);
			},
			sendFeedback: function(feedback) {
				return RestAPIHelper.sendPOST("/api/contacts/feedback", feedback);
			},
		};
	});