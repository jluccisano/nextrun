var logger = require("../logger"),
    underscore = require("underscore");

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

exports.checkUserOwner = function(id, res, next) {
    var user = req.user;

    if (id.equals(user._id)) {
        next();
    } else {
        return res.status(400).json({
            message: ["error.userNotOwner"]
        });
    }
};