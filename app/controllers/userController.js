/**
 * @module User Controller 
 * @author jluccisano
 */

var mongoose = require('mongoose')
, User = mongoose.model('User')
, utils = require('../utils/errorutils')
, email = require('../../config/middlewares/notification');
  
/**
 * @method create new user
 * @param req
 * @param res
 * @returns success if OK
 */
exports.create = function (req, res) {

	var user = new User(req.body);
	user.provider = 'local';
	user.profile = 'user';
	user.last_update = new Date();

	user.save(function (err) {
		if (err) {
			return res.send({response: err}); 
		}
		
		req.logIn(user, function(err) {
			if (err) {
				return res.send({response: err});
			} 
			req.flash('success', 'Félicitation! votre inscription a été validé');
			return res.redirect('/');
		});
	});
};

/**
 * @method authenticate the user
 * @param passport module
 * @param req
 * @param res
 * @returns success or error
 */
exports.authenticate = function (passport, req, res) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { 
            return res.send({response: info}); 
        }
        if (!user) { 
            return res.send({response: info}); 
        }

        req.logIn(user, function(err) {
          if (err) { 
              return res.send({response: info}); 
          }
          return res.send({response: "success"});
        });
    })(req, res);
};

/**
* @method reinitialize password and send an email
* @param req
* @param res
* @returns success or error
*/
exports.forgotPassword = function (req, res) {

    User.findOne({ email: req.body.email }, function (err, user) {
        if (!err && user) { 
          
          //le user existe alors change mot de passe et regenerate new one
          var newPassword = user.generatePassword(6);
          var salt = user.makeSalt();
          var hashed_password = user.encryptPassword( newPassword, salt);

          User.update({ _id: user._id }, {$set: { hashed_password: hashed_password, salt: salt, last_update: new Date() } }, {upsert: true},  function(err){
              
              if (!err) {
                
                email.sendEmailPasswordReinitialized(user.email, newPassword);

                req.flash('success', "Un email vient de vous être envoyé");

                return res.send({ response: 'success' });
              } else {
                req.flash('errors', err);
              }
          });

        } else {
          return res.send({response: "error.invalidEmail"});
        } 
    });
};