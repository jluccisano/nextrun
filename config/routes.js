/*!
 * Module dependencies.
 */

var mainController = require('../app/controllers/mainController'),
	userController = require('../app/controllers/userController'),
	contactController = require('../app/controllers/contactController'),
	raceController = require('../app/controllers/raceController'),
	accessLevels = require('../public/js/client/routingConfig').accessLevels,
	_ = require('underscore'),
	auth = require('./middlewares/authorization');


module.exports = function(app, passport) {
	
/** ROUTES **/

var routes = [

    // Views

    /** workaround: rediction 1and1 **/
   	{
        path: '/defaultsite',
        httpMethod: 'GET',
        middleware: [function(req, res) {
			res.redirect('/');
		}],
		accessLevel: accessLevels.public
    },
    {
        path: '/',
        httpMethod: 'GET',
        middleware: [mainController.index],
        accessLevel: accessLevels.public
    },
    {
        path: '/partials/(:type)?/:name',
        httpMethod: 'GET',
        middleware: [mainController.partials],
        accessLevel: accessLevels.public
    },

    /** JSON API **/

    /** api contacts **/
    {
        path: '/api/contacts',
        httpMethod: 'POST',
        middleware: [mainController.partials],
        accessLevel: accessLevels.public
    },

	/** api users **/
    {
        path: '/api/users/signup',
        httpMethod: 'POST',
        middleware: [userController.signup],
        accessLevel: accessLevels.public
    },
   	{
        path: '/api/users/forgotpassword',
        httpMethod: 'POST',
        middleware: [userController.forgotPassword],
        accessLevel: accessLevels.public
    },
    {
        path: '/api/users/delete',
        httpMethod: 'DELETE',
        middleware: [userController.deleteAccount],
        accessLevel: accessLevels.user
    },
   	{
        path: '/api/users/update/profile',
        httpMethod: 'PUT',
        middleware: [userController.updateProfile],
        accessLevel: accessLevels.user
    },
    {
        path: '/api/users/update/password',
        httpMethod: 'PUT',
        middleware: [userController.updatePassword],
        accessLevel: accessLevels.user
    },
    {
        path: '/api/users/check/email',
        httpMethod: 'POST',
        middleware: [userController.checkIfEmailAlreadyExists],
        accessLevel: accessLevels.public
    },
    {
        path: '/api/users/logout',
        httpMethod: 'POST',
        middleware: [userController.logout],
        accessLevel: accessLevels.user
    },
    {
        path: '/api/users/settings',
        httpMethod: 'GET',
        middleware: [userController.settings],
        accessLevel: accessLevels.user
    },
    {
        path: '/api/users/session',
        httpMethod: 'POST',
        middleware: [function(req, res, next) {
			userController.login(passport, req, res);
		}],
        accessLevel: accessLevels.public
    },

    /** api races **/

    {
        path: '/api/races/create',
        httpMethod: 'POST',
        middleware: [raceController.create],
        accessLevel: accessLevels.user
    },
    {
        path: '/api/races/find/(page/:page)?',
        httpMethod: 'GET',
        middleware: [raceController.findByUser],
        accessLevel: accessLevels.user
    },
   	{
        path: '/api/races/:raceId',
        httpMethod: 'GET',
        middleware: [raceController.find],
        accessLevel: accessLevels.user
    },
    {
        path: '/api/races/:raceId/update',
        httpMethod: 'PUT',
        middleware: [raceController.update],
        accessLevel: accessLevels.user
    },
    {
        path: '/api/races/:raceId/delete',
        httpMethod: 'DELETE',
        middleware: [raceController.delete],
        accessLevel: accessLevels.user
    },


    // redirect all others to the index (HTML5 history)
    {
        path: '*',
        httpMethod: 'GET',
        middleware: [mainController.index],
        accessLevel: accessLevels.public
    },

];



	app.param(':userId', userController.load);
	app.param(':raceId', raceController.load);

	_.each(routes, function(route) {
        route.middleware.unshift(auth.ensureAuthorized);
        var args = _.flatten([route.path, route.middleware]);

        switch(route.httpMethod.toUpperCase()) {
            case 'GET':
                app.get.apply(app, args);
                break;
            case 'POST':
                app.post.apply(app, args);
                break;
            case 'PUT':
                app.put.apply(app, args);
                break;
            case 'DELETE':
                app.delete.apply(app, args);
                break;
            default:
                throw new Error('Invalid HTTP method specified for route ' + route.path);
                break;
        }
    });

	



	/** workaround: rediction 1and1 **/
	/*app.get('/defaultsite', function(req, res) {
		res.redirect('/');
	});*/

	//app.get('/', mainController.index);
	//app.get('/partials/(:type)?/:name', mainController.partials);


	/** JSON API **/

	/** api contacts **/
	//app.post('/api/contacts', auth.ensureAuthorized, contactController.create);


	/** api users **/
	//app.post('/api/users/signup', auth.ensureAuthorized, userController.signup);

	/*app.post('/api/users/session', auth.ensureAuthorized, function(req, res, next) {
		userController.login(passport, req, res);
	});*/

	//app.post('/api/users/logout', auth.ensureAuthorized, userController.logout);

	//app.post('/api/users/forgotpassword', auth.ensureAuthorized, userController.forgotPassword);

	//app.get('/api/users/settings', auth.ensureAuthorized, userController.settings);

	//app.put('/api/users/update/profile', auth.ensureAuthorized, userController.updateProfile);

	//app.put('/api/users/update/password', auth.ensureAuthorized, userController.updatePassword);

	//app.post('/api/users/check/email', auth.ensureAuthorized, userController.checkIfEmailAlreadyExists);

	//app.del('/api/users/delete', auth.ensureAuthorized, userController.deleteAccount);

	//app.param(':userId', userController.load);

	/** api races **/

	//app.post('/api/races/create', auth.ensureAuthorized, raceController.create);

	//app.get('/api/races/find/(page/:page)?', auth.ensureAuthorized, raceController.findByUser);

	//app.get('/api/races/:raceId', auth.ensureAuthorized, raceController.find);

	//app.put('/api/races/:raceId/update', auth.ensureAuthorized, raceController.update);

	//app.del('/api/races/:raceId/delete', auth.ensureAuthorized, raceController.delete);

	//app.param(':raceId', raceController.load);


	// redirect all others to the index (HTML5 history)
	//app.get('*', mainController.index);


};

exports.ensureAuthorized = function(req, res, next) {

 /*   var routes = [



        {
            path: "/api/users/signup",
            accessLevel: accessLevels.public
        }, {
            path: "/api/users/session",
            accessLevel: accessLevels.public
        }, {
            path: "/api/users/forgotpassword",
            accessLevel: accessLevels.public
        }, {
            path: "/api/users/check/email",
            accessLevel: accessLevels.public
        }, {
            path: "/api/contacts",
            accessLevel: accessLevels.public
        }, {
            path: "/api/users/delete",
            accessLevel: accessLevels.user
        }, {
            path: "/api/users/logout",
            accessLevel: accessLevels.user
        }, {
            path: "/api/users/update/profile",
            accessLevel: accessLevels.user
        }, {
            path: "/api/users/update/password",
            accessLevel: accessLevels.user
        }, {
            path: "/api/users/settings",
            accessLevel: accessLevels.user
        }, {
            path: "/partials/user/*",
            accessLevel: accessLevels.user
        }, {
            path: "/partials/race/*",
            accessLevel: accessLevels.public
        }, {
            path: "/api/races/create",
            accessLevel: accessLevels.user
        }, {
            path: "/api/races/find/:raceId",
            accessLevel: accessLevels.user
        }, {
            path: "/api/races/find/(page/:page)?",
            accessLevel: accessLevels.user
        }, {
            path: "/api/races/:raceId/update",
            accessLevel: accessLevels.user
        }, {
            path: "/api/races/:raceId/delete",
            accessLevel: accessLevels.user
        }, {
            path: "/api/races/:raceId",
            accessLevel: accessLevels.public
        }

    ]*/

    var role;
    if (!req.user) {
        role = userRoles.public;
    } else {
        role = req.user.role;
    }
    var accessLevel = _.findWhere(routes, {
        path: req.route.path
    }).accessLevel || accessLevels.public;

    if (!(accessLevel.bitMask & role.bitMask)) {
        return res.send(403, {message: ['error.accessDenied']});
    }
    return next();

};