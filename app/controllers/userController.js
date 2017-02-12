/**
 * @module User Controller 
 * @author jluccisano
 */

var mongoose = require('mongoose')
, User = mongoose.model('User')
, utils = require('../utils/errorutils');
  
/**
 * @method create new user
 * @param req
 * @param res
 * @returns success if OK
 */

exports.create = function (req, res) {
	var user = new User(req.body);
	user.provider = 'local';
	user.profile = 'user';
	user.last_update = new Date();
	user.save(function (err) {
		if (err) {
			return res.render('users/signup', {
				errors: utils.errors(err.errors),
				user: user,
				title: 'Sign up'
			});
		}
		
		req.logIn(user, function(err) {
			if (err) {
				return next(err);
			} 
			req.flash('success', 'Félicitation! votre inscription a été validé');
			return res.redirect('/users/races/home');
		});
	});
};