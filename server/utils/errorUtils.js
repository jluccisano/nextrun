var logger = require("../logger"),
    underscore = require("underscore");
/**
 * Formats mongoose errors into proper array
 *
 * @param {Array} errors
 * @return {Array}
 * @api public
 */
exports.errors = function(errors) {
    var errs = [];
    if (errors instanceof Object) {
        var keys = Object.keys(errors);

        keys.forEach(function(key) {

            if (!underscore.isUndefined(errors[key].message)) {
                errs.push(errors[key].message);
            }

        });

        if (errs.length === 0) {
            logger.error(errors);
            return ["Oops! There was an error"];
        }

    } else {
        logger.error(errors);
        return ["Oops! There was an error"];
    }

    return errs;
};

exports.handleError = function(res, error) {

    logger.error(error);

    return res.status(400).json({
        message: this.errors(error.errors)
    });
};

exports.handleUnknownId = function(res) {
    logger.error("error.unknownId");
    return res.status(400).json({
        message: ["error.unknownId"]
    });
};

exports.handleUnknownData = function(res) {
    logger.error("error.unknownData");
    return res.status(400).json({
        message: ["error.unknownData"]
    });
};

exports.handleRaceAlreadyExists = function(res) {
    logger.error("error.raceAlreadyExists");
    return res.status(400).json({
        message: ["error.raceAlreadyExists"]
    });
};

exports.handleEmailAlreadyExists = function(res) {
    logger.error("error.emailAlreadyExists");
    return res.status(400).json({
        message: ["error.emailAlreadyExists"]
    });
};

exports.handleRouteNotPublished = function(res) {
    logger.error("error.routeNotPublished");
    return res.status(400).json({
        message: ["error.routeNotPublished"]
    });
};

exports.handleFileTypeNotAuthorized = function(res) {
    logger.error("error.fileTypeNotAuhtorized");
    return res.status(400).json({
        message: ["error.fileTypeNotAuhtorized"]
    });
};



