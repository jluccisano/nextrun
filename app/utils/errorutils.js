var logger = require('../../config/logger.js');
/**
 * Formats mongoose errors into proper array
 *
 * @param {Array} errors
 * @return {Array}
 * @api public
 */
exports.errors = function(errors) {
  var errs = []
  if (errors instanceof Object) {
    var keys = Object.keys(errors);

    // if there is no validation error, just display a generic error
    if (!keys) {
      logger.error(errors);
      return ['Oops! There was an error']
    }

    keys.forEach(function(key) {
      errs.push(errors[key].message);
    })
  } else {
    logger.error(errors);
    return ['Oops! There was an error']
  }

  return errs
}