var _ = require('underscore'),
    userRoles = require('../../public/js/client/routingConfig').userRoles,
    util = require('util'),
    accessLevels = require('../../public/js/client/routingConfig').accessLevels;


exports.ensureAuthorized = function(req, res, next) {

    var routes = [

        {
            path: "/users/signup",
            accessLevel: accessLevels.public
        }, {
            path: "/users/session",
            accessLevel: accessLevels.public
        }, {
            path: "/users/forgotpassword",
            accessLevel: accessLevels.public
        }, {
            path: "/users/logout",
            accessLevel: accessLevels.user
        }, {
            path: "/users/check/email",
            accessLevel: accessLevels.public
        }, {
            path: "/users/delete",
            accessLevel: accessLevels.user
        }, {
            path: "/users/update/profile",
            accessLevel: accessLevels.user
        }, {
            path: "/users/update/password",
            accessLevel: accessLevels.user
        }, {
            path: "/contacts",
            accessLevel: accessLevels.public
        }, {
            path: "/users/settings",
            accessLevel: accessLevels.user
        }, {
            path: "/partials/user/*",
            accessLevel: accessLevels.user
        }, {
            path: "/partials/race/*",
            accessLevel: accessLevels.public
        }, {
            path: "/races/create",
            accessLevel: accessLevels.user
        }, {
            path: "/races/find/:raceId",
            accessLevel: accessLevels.user
        }, {
            path: "/races/find/(page/:page)?",
            accessLevel: accessLevels.user
        }, {
            path: "/races/:raceId/update",
            accessLevel: accessLevels.user
        }, {
            path: "/races/:raceId/delete",
            accessLevel: accessLevels.user
        }, {
            path: "/races/:raceId",
            accessLevel: accessLevels.public
        }

    ]

    var role;
    if (!req.user) {
        role = userRoles.public;
    } else {
        role = req.user.role;
    }
    var accessLevel = _.findWhere(routes, {
        path: req.route.path
    }).accessLevel || accessLevels.public;

    if (!(accessLevel.bitMask & role.bitMask)) {
        return res.send(403, {message: ['error.accessDenied']});
    }
    return next();

};