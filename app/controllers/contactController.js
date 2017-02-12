var mongoose = require('mongoose')
  , Contact = mongoose.model('contact')
  , email = require('../../config/middlewares/notification');
 
/**
 * Create
 */
exports.create = function (req, res) {  

  var contact = new Contact(req.body);
  contact.creationDate = new Date();

  contact.create(function (err) {
   if (!err) {
      email.sendEmailNewContact(contact);
      req.flash('success', 'Merci est à bientôt');
      return res.redirect('/');
    } else {
      req.flash('errors', err);
    }
  });
};

/**
 * Find
 */
exports.find = function (req, res, next) {  
  
  Contact.findOne({ email: req.body.email }, function (err, contact) {
      if (err) { 
          console.log("Une erreur s'est produite ! : " + err);
          req.flash('errors', "Une erreur s'est produite !") }
      if (!contact) {
        return next();
      }
      console.log("contact already exists");
      req.flash('errors', 'Désolé mais vous êtes déjà enregistré');
      return res.redirect('/');
  });
};

