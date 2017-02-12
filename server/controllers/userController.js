/**
 * @module User Controller
 * @author jluccisano
 */
var errorUtils = require("../utils/errorUtils"),
    email = require("../middlewares/notification"),
    underscore = require("underscore"),
    passportService = require("../services/passportService"),
    userService = require("../services/userService"),
    logger = require("../logger");


exports.loadUser = function(req, res, next, id) {
    userService.findUser(id, res, function(user) {
        req.userData = user;
        next();
    });
};

exports.getUser = function(req, res) {
    var user = req.userData;
    userService.getUser(user, res, function(user) {
        res.status(200).json(user);
    });
};

exports.signup = function(req, res) {
    var user = req.body.user;
    userService.save(user, res,function(user) {
        passportService.login(user, req, res, function(user) {
            res.status(200).json({
                role: user.role,
                username: user.username,
                email: user.email
            });
        });
    });
};

exports.logout = function(req, res) {
    passportService.logout(req, function() {
        res.status(200).end();
    });
};

exports.session = function(req, res) {
    passportService.authenticate(req, res, function(user) {
        passportService.login(user, req, res, function(user) {
            res.status(200).json({
                role: user.role,
                username: user.username,
                email: user.email
            });
        });
    });
};

exports.getUserByEmail = function(req, res, next) {
    var email = req.body.email;
    userService.getUserByEmail(email, res, function(user) {
        req.user = user;
        next();
    });
};

exports.generateNewPassword = function(req, res) {
    var userConnected = req.user;
    var newPassword = userConnected.generatePassword(6);
    userService.updatePassword(userConnected, newPassword, res, function() {
        email.sendEmailPasswordReinitialized(userConnected.email, newPassword);
        res.status(200).json({
            id: userConnected._id
        });
    });
};

exports.settings = function(req, res) {
    var userConnected = req.user;
    userService.getUser(userConnected, function(user) {
        res.status(200).json(user);
    });
};

exports.checkIfEmailAlreadyExists = function(req, res, next) {
    var user = req.body.user
    userService.getUserByEmail(user, res, function(item) {
        res.sendStatus(200);
    });
};

exports.updateProfile = function(req, res) {
    var userConnected = req.user;
    userConnected.email = req.body.user.email;
    userConnected.username = req.body.user.username;

    userService.save(userConnected, res, function(newUser) {
        res.status(200).json({
            id: newUser._id,
            username: newUser.username,
            email: newUser.email
        });
    });
};

exports.updatePassword = function(req, res) {
    var userConnected = req.user;
    var actualPassword = req.body.actual;
    var newPassword = req.body.new;

    if (!underscore.isUndefined(actualPassword) && !underscore.isUndefined(newPassword)) {
        if (userConnected.authenticate(actualPassword)) {
            userService.updatePassword(userConnected, newPassword, res, function() {
                res.status(200).json({
                    id: userConnected._id
                });
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
};

exports.deleteAccount = function(req, res) {
    var userConnected = req.user;
    userService.deleteUser(userConnected, res, function() {
        req.logout();
        res.sendStatus(200);
    });
};

exports.getUsers = function(req, res) {
    userService.getUsers(req, res, function(users) {
        res.status(200).json({
            items: users
        });
    });
};

exports.deleteUser = function(req, res) {
    var userConnected = req.user;
    userService.deleteUser(userConnected, res, function() {
        res.sendStatus(200);
    });
};