"use strict";

/**
 * Module dependencies.
 */

var underscore = require("underscore"),
    logger = require("../logger"),
    accessLevels = require("../../client/routingConfig").accessLevels,
    userRoles = require("../../client/routingConfig").userRoles;
/**
 *  Register every routes
 */

module.exports.register = function(app, express, routes, routerPath) {

    var router = express.Router();

    var ensureAuthorized = function(req, res, next) {

        var role;

        if (!req.user) {
            role = userRoles.public;
        } else {
            role = req.user.role;
        }
        var accessLevel = underscore.findWhere(routes, {
            path: req.route.path
        }).accessLevel || accessLevels.public;

        if (!(accessLevel.bitMask & role.bitMask)) {
            logger.error("error.accessDenied");
            return res.send(403, {
                message: ["error.accessDenied"]
            });
        }
        return next();
    };

    //app.param(":raceId", raceController.load);

    underscore.each(routes, function(route) {

        route.middleware.unshift(ensureAuthorized);

        switch (route.httpMethod.toUpperCase()) {
            case "GET":
                router.get(route.path, route.middleware);
                break;
            case "POST":
                router.post(route.path, route.middleware);
                break;
            case "PUT":
                router.put(route.path, route.middleware);
                break;
            case "DELETE":
                router.delete(route.path, route.middleware);
                break;
            default:
                throw new Error("Invalid HTTP method specified for route " + route.path);
        }


    });

    app.use(routerPath, router);
};