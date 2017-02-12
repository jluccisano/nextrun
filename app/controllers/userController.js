/**
 * @module User Controller 
 * @author jluccisano
 */

var mongoose = require('mongoose')
, User = mongoose.model('User')
, utils = require('../utils/errorutils')
, util = require('util')
, userRoles = require('../../public/js/client/routingConfig').userRoles
, email = require('../../config/middlewares/notification');
  
/**
 * @method create new user
 * @param req
 * @param res
 * @returns success if OK
 */
exports.signup = function (req, res) {
	var user = new User(req.body);
	user.provider = 'local';
	user.role = userRoles.user;
	user.last_update = new Date();

	user.save(function (err) {
		if (err) {
      return res.json(400,  err );
		}
		
		req.logIn(user, function(err) {
			if (err) {
        return res.json(400,  err );
			} 
      return res.json(200, { "role": user.role, "username": user.username });
		});
	});
};

/**
 * @method Log out session
 * @param req
 * @param res
 * @returns redirect to /
 */
exports.logout = function (req, res) {
  req.logout();
  res.send(200);
};

/**
 * @method authenticate the user
 * @param passport module
 * @param req
 * @param res
 * @returns success or error
 */
exports.login = function (passport, req, res) {
    passport.authenticate('local', function(err, user, message) {
        if (err) { 
            return res.json(400,  message );
        }
        if (!user) { 
            return res.json(400,  message );
        }

        req.logIn(user, function(err) {
          if (err) { 
              return res.json(400,  message );
          }
          return res.json(200, { "role": user.role, "username": user.username });
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
                return res.json(200);
              } else {
                return res.json(400, {message: err.errors });
              }
          });

        } else {          
          return res.json(400, {message: "error.invalidEmail"});
        } 
    });
};

/**
 * @method get user settings
 * @param req
 * @param res
 */
exports.settings = function (req, res) {
   return res.send({user:  {
                        username: req.user.username,
                        email: req.user.email 
                      }
                    });
};
