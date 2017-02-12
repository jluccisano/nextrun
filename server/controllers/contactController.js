var contactService = require("../services/contactService");

exports.loadContact = function(req, res, next, id) {
    contactService.findContact(id, res, function(contact) {
        req.contact = contact;
        next();
    });
};

exports.getContact = function(req, res) {
    contactService.getContact(req, res, function(contact) {
        res.status(200).json(contact);
    });
};

exports.createContact = function(req, res) {
    var contact = req.body;
    contactService.save(contact, res, function(newContact) {
        res.status(200).json({
            id: newContact._id
        });
    });
};

exports.sendFeedback = function(req, res) {
    var feedback = req.body.feedback;
    contactService.sendFeedback(feedback, res, function() {
        res.sendStatus(200);  
    })
};

exports.updateContact = function(req, res) {
    var contact = req.contact;
    contactService.updateContact(contact, res, function() {
        res.status(200).json({
            id: contact._id
        });
    });
};

exports.getContacts = function(req, res) {
    contactService.getContacts(req, res, function(contacts) {
        res.status(200).json({
            items: contacts
        });
    });
};

exports.deleteContact = function(req, res) {
    var contact = req.contact;
    contactService.deleteContact(contact, res, function() {
        res.sendStatus(200);
    });
};