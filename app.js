/*!
 * NEXTRUN
 * Copyright(c) 2013 Joseph Luccisano
 */
var env = process.env.NODE_ENV || 'development';
console.log("run on environment:" + env);

/**
 * Module dependencies.
 */
var express = require('express'),
    fs = require('fs'),
    passport = require('passport'),
	config = require('./config/config')[env],
	mongoose = require('mongoose');

var routes = require('./routes');
var user = require('./routes/user');
var path = require('path');

var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');


var multer = require('multer');
var errorHandler = require('errorhandler');

// Expose config file
app.config = config;

// Database
require('./server/configs/database')(app, mongoose);

// Bootstrap models
var models_path = __dirname + '/server/models';
fs.readdirSync(models_path).forEach(function(file) {
	if (~file.indexOf('.js')) require(models_path + '/' + file);
});


// bootstrap passport config
require('./config/passport')(passport, config);

// Bootstrap express config
require('./server/configs/express')(app, express, passport);

// Bootstrap routes
var routes_path = __dirname + '/server/routes';
fs.readdirSync(routes_path).forEach(function(file) {
  if (~file.indexOf('.js') && file != "index.js")
  	require(routes_path + '/' + file)(app, express);
});

var app = express();




// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon(__dirname + '/client/favicon.ico'));
app.use(logger('dev'));
app.use(methodOverride());
app.use(session({ resave: true,
                  saveUninitialized: true,
                  secret: 'uwotm8' }));

//configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(multer());
app.use(express.static(path.join(__dirname, 'client')));

// development only
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});