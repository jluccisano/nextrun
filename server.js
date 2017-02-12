/*!
 * NEXTRUN
 * Copyright(c) 2013 Joseph Luccisano
 */

// Load configurations
// if test env, load example file
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

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// db connection
mongoose.connect(config.db);

// Bootstrap models
var models_path = __dirname + '/server/models';
fs.readdirSync(models_path).forEach(function(file) {
	if (~file.indexOf('.js')) require(models_path + '/' + file);
});

// bootstrap passport config
require('./config/passport')(passport, config);

var app = express();
// express settings
require('./config/express')(app, config, passport);

// Bootstrap routes
require('./config/routes')(app);

// Start the app by listening on <port>
var port = process.env.PORT || 3000;
app.listen(port);
console.log('Express app started on port ' + port);

// expose app
exports = module.exports = app;