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

	/** api contacts **/
	app.post('/api/contacts', auth.ensureAuthorized, contactController.create);


	/** api users **/
	app.post('/api/users/signup', auth.ensureAuthorized, userController.signup);

	app.post('/api/users/session', auth.ensureAuthorized, function(req, res, next) {
		userController.login(passport, req, res);
	});

	app.post('/api/users/logout', auth.ensureAuthorized, userController.logout);

	app.post('/api/users/forgotpassword', auth.ensureAuthorized, userController.forgotPassword);

	app.get('/api/users/settings', auth.ensureAuthorized, userController.settings);

	app.put('/api/users/update/profile', auth.ensureAuthorized, userController.updateProfile);

	app.put('/api/users/update/password', auth.ensureAuthorized, userController.updatePassword);

	app.post('/api/users/check/email', auth.ensureAuthorized, userController.checkIfEmailAlreadyExists);

	app.del('/api/users/delete', auth.ensureAuthorized, userController.deleteAccount);

	app.param(':userId', userController.load);

	/** api races **/

	app.post('/api/races/create', auth.ensureAuthorized, raceController.create);

	app.get('/api/races/find/(page/:page)?', auth.ensureAuthorized, raceController.findByUser);

	app.get('/api/races/:raceId', auth.ensureAuthorized, raceController.find);

	app.put('/api/races/:raceId/update', auth.ensureAuthorized, raceController.update);

	app.del('/api/races/:raceId/delete', auth.ensureAuthorized, raceController.delete);

	app.param(':raceId', raceController.load);


	// redirect all others to the index (HTML5 history)
	app.get('*', mainController.index);


};