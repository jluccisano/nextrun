/**
 * Module dependencies.
 */

var express = require('express')
	,mongoStore = require('connect-mongo')(express)
	,helpers = require('view-helpers')
	,i18n = require('i18next')
	,flash = require('connect-flash')
	,pkg = require('../package.json');

i18n.init({
	saveMissing: false,
	debug: false,
	supportedLngs: ['fr-Fr'],
	fallbackLng : 'fr-Fr',
	detectLngFromPath: 0,
	ignoreRoutes: ['img/', 'js/', 'css/'],
	sendMissingTo: 'fallback',
});



module.exports = function (app, config, passport) {

	app.use(i18n.handle);

	app.set('showStackError', true);

	// should be placed before express.static
	app.use(express.compress({
		filter: function (req, res) {
		return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
	},
	level: 9
	}));
	
	
	app.use(express.favicon());
	app.use(express.static(config.root + '/public'));

	// don't use logger for test env
	if (process.env.NODE_ENV !== 'test') {
		app.use(express.logger('dev'));
	}

	// set views path, template engine and default layout
	app.set('views', config.root + '/app/views');
	app.set('view engine', 'jade');

	app.configure(function () {

	// expose package.json to views
	app.use(function (req, res, next) {
		res.locals.pkg = pkg;
		next();
    });
	
	// cookieParser should be above session
	app.use(express.cookieParser());

	// bodyParser should be above methodOverride
	app.use(express.bodyParser());
	app.use(express.methodOverride());

	// express/mongo session storage
	app.use(express.session({
		secret: 'noobjs',
		store: new mongoStore({
		url: config.db,
		collection : 'sessions'
		})
	}));

	// use passport session
	app.use(passport.initialize());
	app.use(passport.session());
	
	// connect flash for flash messages - should be declared after sessions
	app.use(flash());

	 // should be declared after session and flash
	app.use(helpers(pkg.name));


	var csrfValue = function(req) {
	  var token = (req.body && req.body._csrf)
	    || (req.query && req.query._csrf)
	    || (req.headers['x-csrf-token'])
	    || (req.headers['x-xsrf-token']);
	  return token;
	};

	//app.use(express.csrf());
	app.use(express.csrf({value: csrfValue}));
	
	// This could be moved to view-helpers :-)
	app.use(function(req, res, next){
		res.locals.csrf_token = req.csrfToken();
		res.cookie('XSRF-TOKEN', req.csrfToken());
		next();
	});



	// routes should be at the last
	app.use(app.router);

	app.use(express.logger('dev'));
	
	// assume "not found" in the error msgs
	// is a 404. this is somewhat silly, but
	// valid, you can do whatever you like, set
	// properties, use instanceof etc.
	app.use(function(err, req, res, next){
		// treat as 404
		if (err.message && (~err.message.indexOf('not found')
			|| (~err.message.indexOf('Cast to ObjectId failed')))) {
			return next();
		}

		// log it
		// send emails if you want
		console.error(err.stack);

		// error page
		res.status(500).render('errors/500', { error: err.stack });
	});

	// assume 404 since no middleware responded
	app.use(function(req, res, next){
		res.status(404).render('errors/404', {
		url: req.originalUrl,
		error: 'Not found'
		});
	});

});

i18n.registerAppHelper(app);

// development env config
app.configure('development', function () {
	app.locals.pretty = true;
});

};