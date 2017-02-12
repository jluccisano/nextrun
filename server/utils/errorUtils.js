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