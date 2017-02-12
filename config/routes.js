/*!
 * Module dependencies.
 */



module.exports = function (app, passport) {

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

};