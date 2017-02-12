var underscore = require("underscore"),
    errorUtils = require("./errorUtils");

exports.checkBodyParams = function(req, res, next) {
    var body = req.body;

    if (!underscore.isUndefined(body) && !underscore.isUndefined(body.data)) {
        next();
    } else {
        return res.status(400).json({
            message: ["error.bodyParamRequired"]
        });
    }
};

exports.checkUserConnected = function(req, res, next) {
    var user = req.user;

    if (!underscore.isUndefined(user) && !underscore.isUndefined(user._id)) {
        next();
    } else {
        return res.status(400).json({
            message: ["error.userNotConnected"]
        });
    }
};

exports.checkUserOwner = function(id, req, res, next) {
    var user = req.user;

    if (id.equals(user._id)) {
        next();
    } else {
        return res.status(400).json({
            message: ["error.userNotOwner"]
        });
    }
};

exports.checkRouteNotPublished = function(req, res, next) {
    var route = req.routeData;
    var user = req.user;

    if (!underscore.isUndefined(route)) {
        if ((!user && route.published === false) || (user && user._id !== route.userId.toString() && route.published === false)) {
            errorUtils.handleRouteNotPublished(res);
        } else {
            next();
        }
    } else {
        errorUtils.handleUnknownData(res);
    }
};