angular.module('nextrunApp')
	.factory('ContactServices', function($http) {
		'use strict';
		return {
			addContact: function(contact, success, error) {
				$http.post('/contacts', contact).success(function() {
					success();
				}).error(error);
			}
		};
	});