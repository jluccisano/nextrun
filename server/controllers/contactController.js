var mongoose = require("mongoose"),
  Contact = mongoose.model("Contact"),
  errorUtils = require("../utils/errorUtils"),
  email = require("../../config/middlewares/notification"),
  logger = require("../../config/logger.js"),
  _ = require("underscore");

/**
 * Create
 */
exports.create = function(req, res) {

  var newContact;
  if (!_.isUndefined(req.body)) {

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

  if (!_.isUndefined(req.body) && !_.isUndefined(req.body.feedback)) {

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