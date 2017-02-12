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
app.get('/partials/:name', mainController.partials);
app.get('/partials/race/:name', mainController.racePartials);
app.get('/partials/user/:name', mainController.userPartials);


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

app.param(':userId', userController.load);

/** races **/

app.post('/races',  auth.ensureAuthorized, raceController.create);

app.param(':raceId', raceController.load);


};