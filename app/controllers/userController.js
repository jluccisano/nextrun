/**
 * @module User Controller
 * @author jluccisano
 */

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  errorUtils = require('../utils/errorutils'),
  util = require('util'),
  userRoles = require('../../public/js/routingConfig').userRoles,
  passport =  require('passport'),
  email = require('../../config/middlewares/notification'),
  logger = require('../../config/logger.js');


/**
 * @method create new user
 * @param req
 * @param res
 * @returns success if OK
 */
exports.signup = function(req, res) {
  var user = new User(req.body.user);
  user.provider = 'local';
  user.role = userRoles.user;
  user.last_update = new Date();

  user.save(function(err) {
    if (err) {
      logger.error(err);
      return res.json(400, {
        message: errorUtils.errors(err.errors)
      });
    }

    req.logIn(user, function(err) {
      if (err) {
        logger.error(err);
        return res.json(400, {
          message: errorUtils.errors(err.errors)
        });
      }
      return res.json(200, {
        role: user.role,
        username: user.username,
        email: user.email
      });
    });
  });
};

/**
 * @method Log out session
 * @param req
 * @param res
 * @returns redirect to /
 */
exports.logout = function(req, res) {
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
exports.login = function(req, res) {
  passport.authenticate('local', function(err, user, message) {
    if (err) {
      logger.error(message);
      return res.json(400, message);
    }
    if (!user) {
      logger.error(message);
      return res.json(400, message);
    }

    req.logIn(user, function(err) {
      if (err) {
        logger.error(err);
        return res.json(400, message);
      }
      return res.json(200, {
        "role": user.role,
        "username": user.username
      });
    });
  })(req, res);
};

/**
 * @method reinitialize password and send an email
 * @param req
 * @param res
 * @returns success or error
 */
exports.forgotPassword = function(req, res) {

  User.findOne({
    email: req.body.user.email
  }, function(err, user) {
    if (!err && user) {

      //le user existe alors change mot de passe et regenerate new one
      var newPassword = user.generatePassword(6);
      var salt = user.makeSalt();
      var hashed_password = user.encryptPassword(newPassword, salt);

      User.update({
        _id: user._id
      }, {
        $set: {
          hashed_password: hashed_password,
          salt: salt,
          last_update: new Date()
        }
      }, {
        upsert: true
      }, function(err) {

        if (!err) {
          email.sendEmailPasswordReinitialized(user.email, newPassword);
          return res.json(200);
        } else {
          logger.error(err);
          return res.json(400, {
            message: errorUtils.errors(err.errors)
          });
        }
      });

    } else {
      logger.error("error.invalidEmail");
      return res.json(400, {
        message: ["error.invalidEmail"]
      });
    }
  });
};

/**
 * @method get user settings
 * @param req
 * @param res
 */
exports.settings = function(req, res) {
  return res.json(200, {
    user: {
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email
    }
  });
};

/**
 * @method check if email already exists
 * @param req
 * @param res
 * @param next
 */
exports.checkIfEmailAlreadyExists = function(req, res) {
  User.findOne({
    email: req.body.user.email
  }, function(err, user) {
    if (err) {
      logger.error(err);
      return res.json(400, {
        message: errorUtils.errors(err.errors)
      });
    }
    if (!user) {
      return res.json(200);
    }
    logger.error("error.emailAlreadyExists");
    return res.json(400, {
      message: ["error.emailAlreadyExists"]
    });
  });
}

/**
 * @method update profile of user
 * @param req
 * @param res
 */
exports.updateProfile = function(req, res) {

  var user = req.user;
  user.email = req.body.user.email;
  user.username = req.body.user.username;

  user.save(function(err) {
    if (err) {
      logger.error(err);
      return res.json(400, {
        message: errorUtils.errors(err.errors)
      });
    }
    return res.json(200, {
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      }
    });
  });
};

/**
 * @method update password
 * @param req
 * @param res
 */
exports.updatePassword = function(req, res) {

  var user = req.user;

  var actualPassword = req.body.actual;

  if (user.authenticate(actualPassword)) {

    var newPassword = req.body.new;

    //encrypt new password
    var salt = user.makeSalt();
    var hashed_newPassword = user.encryptPassword(newPassword, salt);

    User.update({
      _id: user._id
    }, {
      $set: {
        hashed_password: hashed_newPassword,
        salt: salt,
        last_update: new Date()
      }
    }, {
      upsert: true
    }, function(err) {
      if (!err) {
        return res.json(200);

      } else {
        logger.error("error.occured");
        return res.json(400, {
          message: ["error.occured"]
        });
      }
    });
  } else {
    logger.error("error.invalidPassword");
    return res.json(400, {
      message: ["error.invalidPassword"]
    });
  }
};


/**
 * @method delete user account
 * @param req
 * @param res
 */
exports.deleteAccount = function(req, res) {
  User.destroy(req.user._id, function(err) {
    if (!err) {
      req.logout();
      return res.json(200);
    } else {
      logger.error(err);
      return res.json(400, {
        message: errorUtils.errors(err.errors)
      });
    }
  });
};