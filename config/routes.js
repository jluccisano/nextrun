/*!
 * Module dependencies.
 */

var mainController = require('../app/controllers/mainController'),
	userController = require('../app/controllers/userController'),
	contactController = require('../app/controllers/contactController'),
	raceController = require('../app/controllers/raceController'),
	auth = require('./middlewares/authorization');


module.exports = function(app, passport) {

	/** ROUTES **/



	/** workaround: rediction 1and1 **/
	app.get('/defaultsite', function(req, res) {
		res.redirect('/');
	});

	app.get('/', mainController.index);
	app.get('/partials/(:type)?/:name', mainController.partials);


	/** JSON API **/

	/** contacts **/
	app.post('/contacts', auth.ensureAuthorized, contactController.create);


	/** users **/
	app.post('/users/signup', auth.ensureAuthorized, userController.signup);

	app.post('/users/session', auth.ensureAuthorized, function(req, res, next) {
		userController.login(passport, req, res);
	});

	app.post('/users/logout', auth.ensureAuthorized, userController.logout);

	app.post('/users/forgotpassword', auth.ensureAuthorized, userController.forgotPassword);

	app.get('/users/settings', auth.ensureAuthorized, userController.settings);

	app.put('/users/update/profile', auth.ensureAuthorized, userController.updateProfile);

	app.put('/users/update/password', auth.ensureAuthorized, userController.updatePassword);

	app.post('/users/check/email', auth.ensureAuthorized, userController.checkIfEmailAlreadyExists);

	app.del('/users/delete', auth.ensureAuthorized, userController.deleteAccount);



	app.param(':userId', userController.load);

	/** races **/

	app.post('/races/create', auth.ensureAuthorized, raceController.create);

	app.get('/races/find/(page/:page)?', auth.ensureAuthorized, raceController.findByUser);

	app.get('/races/:raceId', auth.ensureAuthorized, raceController.find);

	app.put('/races/:raceId/update', auth.ensureAuthorized, raceController.update);

	app.del('/races/:raceId/delete', auth.ensureAuthorized, raceController.delete);

	app.param(':raceId', raceController.load);


	// redirect all others to the index (HTML5 history)
	app.get('*', mainController.index);


};