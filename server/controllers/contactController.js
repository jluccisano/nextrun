var mongoose = require("mongoose"),
    Contact = mongoose.model("Contact"),
    errorUtils = require("../utils/errorUtils"),
    email = require("../middlewares/notification"),
    logger = require("../logger"),
    underscore = require("underscore");

/**
 * Create
 */
exports.create = function(req, res) {

    var newContact;
    if (!underscore.isUndefined(req.body)) {

        newContact = req.body;

        var contact = new Contact(newContact);
        contact.save(function(err) {
            if (!err) {
                email.sendEmailNewContact(contact);
                return res.json(200);
            } else {
                logger.error(err);
                return res.json(400, {
                    message: errorUtils.errors(err.errors)
                });
            }
        });
    } else {
        return res.json(400, {
            message: ["error.bodyParamRequired"]
        });
    }
};

/**
 * Send a feedback
 * email, type (bug,Information erronée,dupliquer,autre), message
 */
exports.feedback = function(req, res) {

    var feedback;

    if (!underscore.isUndefined(req.body) && !underscore.isUndefined(req.body.feedback)) {

        feedback = req.body.feedback;
        email.sendEmailNewFeedback(feedback);
        return res.json(200);
    } else {
        logger.error("error.occured");
        return res.json(400, {
            message: ["error.occured"]
        });
    }
};