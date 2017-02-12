/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , async = require('async')
  , Contact = mongoose.model('Contact')
  , User = mongoose.model('User');

/**
 * Clear database
 *
 * @param {Function} done
 * @api public
 */

exports.clearDb = function (done) {
  async.parallel([
    function (cb) {
      User.collection.remove(cb);
    },
    function (cb) {
      Contact.collection.remove(cb);
    },
  ], done);
}