var mongoose = require('mongoose')
  , Contact = mongoose.model('Contact')
  , utils = require('../utils/errorutils')
  , email = require('../../config/middlewares/notification');
 
/**
 * Create
 */
exports.create = function (req, res) {  

  var contact = new Contact(req.body);
  contact.save(function (err) {
   if (!err) {
      email.sendEmailNewContact(contact);
      req.flash('success', 'Merci est à bientôt');
      return res.redirect('/');
    } else {
      req.flash('errors', utils.errors(err.errors));
      return res.redirect('/');
    }
  });
};

