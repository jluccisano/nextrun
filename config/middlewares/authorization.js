var _ = require('underscore'),
    userRoles = require('../../public/js/routingConfig').userRoles,
    util = require('util'),
    accessLevels = require('../../public/js/routingConfig').accessLevels,
    logger = require('../logger.js');



exports.ensureAuthorized = function(req, res, next, routes) {

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
        logger.error("error.accessDenied");
        return res.send(403, {message: ["error.accessDenied"]});
    }
    return next();

};