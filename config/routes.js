/*!
 * Module dependencies.
 */

var mainController = require('../app/controllers/mainController');

module.exports = function (app, passport) {

/** ROUTES **/

app.get('/', mainController.index);
app.get('/partials/:name', mainController.partials);


/** JSON API **/

};