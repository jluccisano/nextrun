/*!
 * Module dependencies.
 */

var mainController = require('../app/controllers/mainController')
,userController = require('../app/controllers/userController')
,contactController = require('../app/controllers/contactController')
,raceController = require('../app/controllers/raceController')
,auth = require('./middlewares/authorization');


module.exports = function (app, passport) {

/** ROUTES **/

/** workaround: rediction 1and1 **/
app.get('/defaultsite', function (req, res) {  
  res.redirect('/');
});

app.get('/', mainController.index);
app.get('/partials/(:type)?/:name', mainController.partials);


/** JSON API **/

/** contacts **/
app.post('/contacts', auth.ensureAuthorized, contactController.create);


/** users **/
app.post('/users/signup',  auth.ensureAuthorized, userController.signup);

app.post('/users/session',auth.ensureAuthorized, function(req, res, next) {
	userController.login(passport, req, res);
});

app.post('/users/logout', auth.ensureAuthorized, userController.logout);

app.post('/users/forgotpassword', auth.ensureAuthorized, userController.forgotPassword);

app.get('/users/settings', auth.ensureAuthorized , userController.settings);

app.put('/users/:userId/update/profile', auth.ensureAuthorized, userController.updateProfile);

app.put('/users/:userId/update/password', auth.ensureAuthorized, userController.updatePassword);

app.post('/users/check/email', auth.ensureAuthorized, userController.checkIfEmailAlreadyExists);

app.del('/users/:userId', auth.ensureAuthorized, userController.deleteAccount);

app.get('/users/:userId/races/(page/:page)?',  auth.ensureAuthorized, raceController.findByUser);


app.param(':userId', userController.load);

/** races **/

app.post('/races',  auth.ensureAuthorized, userController.checkUser, raceController.create);

app.del('/races/:raceId',  auth.ensureAuthorized, userController.checkUser, raceController.delete);

app.put('/races/:raceId',  auth.ensureAuthorized, userController.checkUser, raceController.update);


app.param(':raceId', raceController.load);


};