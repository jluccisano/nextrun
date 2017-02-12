"use strict";

angular.module("nextrunApp.commons").factory("ContactService",
	function(HttpUtils) {
		
		return {
			find: function(page) {
                return HttpUtils.get("/api/contacts/find/page/" + page);
            },
            delete: function(id) {
                return HttpUtils.delete("/api/contacts/" + id + "/delete");
            },
			addContact: function(contact) {
				return HttpUtils.post("/api/contacts/new", contact);
			},
			sendFeedback: function(feedback) {
				return HttpUtils.post("/api/contacts/feedback", feedback);
			},
		};
	});