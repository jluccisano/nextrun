angular.module('nextrunApp')
	.factory('ContactServices', function($http) {
		'use strict';
		return {
			addContact: function(contact, success, error) {
				$http.post('/api/contacts', contact).success(function() {
					success();
				}).error(error);
			},
			sendFeedback: function(feedback, success, error) {
				$http.post('/api/contacts/feedback', feedback).success(function() {
					success();
				}).error(error);
			},
		};
	});