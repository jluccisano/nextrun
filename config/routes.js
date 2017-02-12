/*!
 * Module dependencies.
 */

var mainController = require('../app/controllers/mainController')
,userController = require('../app/controllers/userController')
,contactController = require('../app/controllers/contactController');


module.exports = function (app, passport) {

/** ROUTES **/

/** workaround: rediction 1and1 **/
app.get('/defaultsite', function (req, res) {  
  res.redirect('/');
});

app.get('/', mainController.index);
app.get('/partials/:name', mainController.partials);


/** JSON API **/

/** contacts **/
app.post('/contacts', contactController.create);


/** users **/
app.post('/users', userController.create);


};