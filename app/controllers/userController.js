/**
 * @module User Controller
 * @author jluccisano
 */

var mongoose = require("mongoose"),
  User = mongoose.model("User"),
  errorUtils = require("../utils/errorUtils"),
  userRoles = require("../../public/js/routingConfig").userRoles,
  passport = require("passport"),
  email = require("../../config/middlewares/notification"),
  _ = require("underscore"),
  logger = require("../../config/logger.js");


/**
 * @method create new user
 * @param req
 * @param res
 * @returns success if OK
 */
exports.signup = function(req, res) {
  var newUser;

  if (!_.isUndefined(req.body) && !_.isUndefined(req.body.user)) {

    newUser = req.body.user;

    var user = new User(newUser);
    user.provider = "local";
    user.role = userRoles.user;
    user.lastUpdate = new Date();

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
  } else {
    return res.json(400, {
      message: ["error.bodyParamRequired"]
    });
  }
};

/**
 * @method Log out session
 * @param req
 * @param res
 * @returns redirect to /
 */
exports.logout = function(req, res) {
  req.logout();
  return res.send(200);
};

/**
 * @method authenticate the user
 * @param passport module
 * @param req
 * @param res
 * @returns success or error
 */
exports.login = function(req, res) {

  passport.authenticate("local", function(err, user, message) {
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

  var reqUser;

  if (!_.isUndefined(req.body) && !_.isUndefined(req.body.user)) {

    reqUser = req.body.user;

    User.findOne({
      email: reqUser.email
    }, function(err, user) {
      if (!err && user) {

        //le user existe alors change mot de passe et regenerate new one
        var newPassword = user.generatePassword(6);
        var salt = user.makeSalt();
        var hashedPassword = user.encryptPassword(newPassword, salt);

        User.update({
          _id: user._id
        }, {
          $set: {
            hashed_password: hashedPassword,
            salt: salt,
            lastUpdate: new Date()
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
  } else {
    return res.json(400, {
      message: ["error.bodyParamRequired"]
    });
  }
};

/**
 * @method get user settings
 * @param req
 * @param res
 */
exports.settings = function(req, res) {

  var userConnected;

  if (!_.isUndefined(req.user)) {

    userConnected = req.user;

    return res.json(200, {
      user: {
        _id: userConnected._id,
        username: userConnected.username,
        email: userConnected.email
      }
    });
  } else {
    return res.json(400, {
      message: ["error.userNotConnected"]
    });
  }

};

/**
 * @method check if email already exists
 * @param req
 * @param res
 * @param next
 */
exports.checkIfEmailAlreadyExists = function(req, res) {

  var reqUser;

  if (!_.isUndefined(req.body) && !_.isUndefined(req.body.user)) {

    reqUser = req.body.user;

    User.findOne({
      email: reqUser.email
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
  } else {
    return res.json(400, {
      message: ["error.bodyParamRequired"]
    });
  }
};

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

  var userConnected;

  if (!_.isUndefined(req.user)) {

    userConnected = req.user;

    if (!_.isUndefined(req.body) && !_.isUndefined(req.body.actual) && !_.isUndefined(req.body.new)) {

      var actualPassword = req.body.actual;

      if (userConnected.authenticate(actualPassword)) {

        var newPassword = req.body.new;

        //encrypt new password
        var salt = userConnected.makeSalt();
        var hashedNewPassword = userConnected.encryptPassword(newPassword, salt);

        User.update({
          _id: userConnected._id
        }, {
          $set: {
            hashed_password: hashedNewPassword,
            salt: salt,
            lastUpdate: new Date()
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
    } else {
      return res.json(400, {
        message: ["error.bodyParamRequired"]
      });
    }

  } else {
    return res.json(400, {
      message: ["error.userNotConnected"]
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