var passport = require("passport"),
	errorUtils = require("../utils/errorUtils");

exports.login = function(user, req, res, cb) {
	req.login(user, function(error) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			cb(user);
		}
	});
};

exports.logout = function(req, cb) {
	req.logout();
	cb();
};

exports.authenticate = function(req, res, cb) {
	passport.authenticate("local", function(error, user, message) {
		if (error) {
			console.log("error"+error);
			console.log("user"+user);
			console.log("mess"+message);
			res.status(400).json(message);
		} else {
			cb(user);
		}
	})(req, res);;
};