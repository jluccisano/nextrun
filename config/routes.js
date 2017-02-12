/*!
 * Module dependencies.
 */

var mainController = require('../app/controllers/mainController')
,userController = require('../app/controllers/userController')
,contactController = require('../app/controllers/contactController')
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
app.post('/contacts', contactController.create);


/** users **/
app.post('/users', userController.create);

app.post('/users/session', function(req, res, next) {
	userController.authenticate(passport, req, res);
});

app.get('/logout', userController.logout);

app.post('/users/forgotpassword', userController.forgotPassword);

app.get('/users/settings', auth.requiresLogin, userController.settings);

};