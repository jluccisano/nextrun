/*!
 * Module dependencies.
 */

var mainController = require('../app/controllers/mainController');

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
app.post('/contacts', contactController.find, contactController.create);

};