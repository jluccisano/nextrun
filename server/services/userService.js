var errorUtils = require("../utils/errorUtils"),
	mongoose = require("mongoose"),
	User = mongoose.model("User"),
	email = require("../middlewares/notification");


exports.save = function(user, res, cb) {
	
	if(!user._id) {
	   user = new User(user);
	}

	user.save(function(error, newUser) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			email.sendNewUser(user);
			cb(newUser);
		}
	});
};

exports.getUserByEmail = function(email, res, cb) {

	var criteria = {
		email: email
	};

	User.findOneByCriteria(criteria, function(error, user) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			cb(user);
		}
	});
};

exports.getUser = function(user, cb) {
	var userProfile = {
		_id: user.id,
		username: user.username,
		email: user.email
	};

	cb(userProfile);
};

exports.updatePassword = function(user, newPassword, res, cb) {
	var salt = user.makeSalt();
	var hashedNewPassword = user.encryptPassword(newPassword, salt);

	var query = {
		_id: user._id
	};

	var update = {
		$set: {
			hashedPassword: hashedNewPassword,
			salt: salt,
			lastUpdate: new Date()
		}
	};

	var options = {
		upsert: true
	};

	User.update(query, update, function(error) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			cb();
		}
	}, options);
};

exports.deleteUser = function(user, res, cb) {
	User.deleteById(user._id, function(error) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			cb();
		}
	});
};

exports.getUsers = function(req, res, cb) {

	var criteria = {};

	var projection = {
		hashedPassword: 0
	};

	var limit = 10;
	var skip = 0;

	skip = req.params.page ? (parseInt(req.params.page) - 1) * limit : skip;

	User.findByCriteria(criteria, function(error, users) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			cb(users);
		}
	}, projection, limit, skip);

};

exports.checkIfUserNameAvailable = function(name, user, res, cb) {

	var criteria = {
		name: name,
		_id: {
			$ne: user._id
		}
	};

	User.findByCriteria(criteria, function(error, users) {
		if (error) {
			errorUtils.handleError(res, error);
		} else {
			cb(users);
		}
	});
};