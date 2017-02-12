"use strict";

angular.module("nextrunApp.commons").factory("ContactService",
	function(HttpUtils) {
		
		return {
			addContact: function(contact) {
				return HttpUtils.post("/api/contacts", contact);
			},
			sendFeedback: function(feedback) {
				return HttpUtils.post("/api/contacts/feedback", feedback);
			},
		};
	});