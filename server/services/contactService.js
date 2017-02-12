var errorUtils = require("../utils/errorUtils"),
	mongoose = require("mongoose"),
	underscore = require("underscore"),
	email = require("../middlewares/notification"),
	Contact = mongoose.model("Contact");


exports.save = function(contact, res, cb) {

	if (!contact._id) {
		contact = new Contact(contact);
	}

	contact.save(function(error, newContact) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			email.sendEmailNewContact(newContact);
			cb(newContact);
		}
	});
};

exports.getContacts = function(req, res, cb) {

	var criteria = {};

	var projection = {};	

	var limit = 10;
	var skip = 0;

	skip = req.params.page ? (parseInt(req.params.page) - 1) * limit : skip;

	Contact.findByCriteria(criteria, function(error, contacts) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			cb(contacts);
		}
	}, projection, limit, skip);

};

exports.findContact = function(id, res, cb) {
	Contact.findById(id, function(error, contact) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			cb(contact);
		}
	});
};

exports.getContact = function(req, res, cb) {
	var contact = req.contact;
	if (!underscore.isUndefined(contact)) {
		cb(contact);
	} else {
		errorUtils.handleUnknownData(res);
	}
};

exports.deleteContact = function(contact, res, cb) {
	Contact.deleteById(contact._id, function(error) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			cb();
		}
	});
};

exports.updateContact = function(contact, req, res, cb) {
	var fieldsToUpdate = req.body.fields;
	fieldsToUpdate.lastUpdate = new Date();

	var query = {
		_id: contact._id
	};

	var update = {
		$set: fieldsToUpdate
	};

	var options = {
		upsert: true
	};

	Contact.update(query, update, function(error) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			cb();
		}
	}, options);
};

exports.sendFeedback = function(feedback, res, cb) {
	email.sendEmailNewFeedback(feedback);
	cb();
};