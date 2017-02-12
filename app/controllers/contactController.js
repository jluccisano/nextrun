var mongoose = require('mongoose'),
  Contact = mongoose.model('Contact'),
  errorUtils = require('../utils/errorutils'),
  email = require('../../config/middlewares/notification');

/**
 * Create
 */
exports.create = function(req, res) {

  var contact = new Contact(req.body);
  contact.save(function(err) {
    if (!err) {
      email.sendEmailNewContact(contact);
      return res.json(200);
    } else {
      return res.json(400, {
        message: errorUtils.errors(err.errors)
      });
    }
  });
};

/**
 * Send a feedback
 * email, type (bug,Information erronée,dupliquer,autre), message
 */
exports.feedback = function(req, res) {

  var feedback = req.body.feedback;

  if (feedback) {
    email.sendEmailNewFeedback(feedback);
    return res.json(200);
  } else {
    return res.json(400, {
      message: ["error.occured"]
    });
  }
};