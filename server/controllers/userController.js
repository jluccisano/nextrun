/**
 * @module User Controller
 * @author jluccisano
 */

var mongoose = require("mongoose"),
    User = mongoose.model("User"),
    errorUtils = require("../utils/errorUtils"),
    userRoles = require("../../client/routingConfig").userRoles,
    passport = require("passport"),
    email = require("../middlewares/notification"),
    underscore = require("underscore"),
    logger = require("../logger");


/**
 * @method create new user
 * @param req
 * @param res
 * @returns success if OK
 */
exports.signup = function(req, res) {
    var newUser;

    if (!underscore.isUndefined(req.body) && !underscore.isUndefined(req.body.user)) {

        newUser = req.body.user;

        var user = new User(newUser);
        user.provider = "local";
        user.role = userRoles.user;
        user.lastUpdate = new Date();

        user.save(function(err) {
            if (err) {
                logger.error(err);
                return res.status(400).json({
                    message: errorUtils.errors(err.errors)
                });
            }

            req.logIn(user, function(err) {
                if (err) {
                    logger.error(err);
                    return res.status(400).json({
                        message: errorUtils.errors(err.errors)
                    });
                }
                return res.status(200).json({
                    role: user.role,
                    username: user.username,
                    email: user.email
                });
            });
        });
    } else {
        return res.status(400).json({
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
    return res.status(200).end();
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
            return res.status(400).json(message);
        }
        if (!user) {
            logger.error(message);
            return res.status(400).json(message);
        }

        req.logIn(user, function(err) {
            if (err) {
                logger.error(err);
                return res.status(400).json(message);
            }
            return res.status(200).json({
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

    if (!underscore.isUndefined(req.body) && !underscore.isUndefined(req.body.user)) {

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
                        hashedPassword: hashedPassword,
                        salt: salt,
                        lastUpdate: new Date()
                    }
                }, {
                    upsert: true
                }, function(err) {

                    if (!err) {
                        email.sendEmailPasswordReinitialized(user.email, newPassword);
                        return res.status(200);
                    } else {
                        logger.error(err);
                        return res.status(400).json({
                            message: errorUtils.errors(err.errors)
                        });
                    }
                });

            } else {
                logger.error("error.invalidEmail");
                return res.status(400).json({
                    message: ["error.invalidEmail"]
                });
            }
        });
    } else {
        return res.status(400).json({
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

    if (!underscore.isUndefined(req.user)) {

        userConnected = req.user;

        return res.status(200).json({
            user: {
                _id: userConnected._id,
                username: userConnected.username,
                email: userConnected.email
            }
        });
    } else {
        return res.status(400).json({
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

    if (!underscore.isUndefined(req.body) && !underscore.isUndefined(req.body.user)) {

        reqUser = req.body.user;

        User.findOne({
            email: reqUser.email
        }, function(err, user) {
            if (err) {
                logger.error(err);
                return res.status(400).json({
                    message: errorUtils.errors(err.errors)
                });
            }
            if (!user) {
                return res.status(200);
            }
            logger.error("error.emailAlreadyExists");
            return res.status(400).json({
                message: ["error.emailAlreadyExists"]
            });
        });
    } else {
        return res.status(400).json({
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
            return res.status(400).json({
                message: errorUtils.errors(err.errors)
            });
        }
        return res.status(200).json({
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

    if (!underscore.isUndefined(req.user)) {

        userConnected = req.user;

        if (!underscore.isUndefined(req.body) && !underscore.isUndefined(req.body.actual) && !underscore.isUndefined(req.body.new)) {

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
                        hashedPassword: hashedNewPassword,
                        salt: salt,
                        lastUpdate: new Date()
                    }
                }, {
                    upsert: true
                }, function(err) {
                    if (!err) {
                        return res.status(200);

                    } else {
                        logger.error("error.occured");
                        return res.status(400).json({
                            message: ["error.occured"]
                        });
                    }
                });
            } else {
                logger.error("error.invalidPassword");
                return res.status(400).json({
                    message: ["error.invalidPassword"]
                });
            }
        } else {
            return res.status(400).json({
                message: ["error.bodyParamRequired"]
            });
        }

    } else {
        return res.status(400).json({
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
            return res.status(200);
        } else {
            logger.error(err);
            return res.status(400).json({
                message: errorUtils.errors(err.errors)
            });
        }
    });
};