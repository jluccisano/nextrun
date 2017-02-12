/*!
 * Module dependencies.
 */

var mainController = require('../app/controllers/mainController'),
    userController = require('../app/controllers/userController'),
    contactController = require('../app/controllers/contactController'),
    raceController = require('../app/controllers/raceController'),
    accessLevels = require('../public/js/client/routingConfig').accessLevels,
    userRoles = require('../public/js/client/routingConfig').userRoles,
    _ = require('underscore'),
    util = require('util'),
    gmaps = require('./middlewares/gmaps'),
    auth = require('./middlewares/authorization');


/** ROUTES **/

var routes = [

    // Views

    /** workaround: rediction 1and1 **/
    {
        path: '/defaultsite',
        httpMethod: 'GET',
        middleware: [

            function(req, res) {
                res.redirect('/');
            }
        ],
        accessLevel: accessLevels.public
    }, {
        path: '/',
        httpMethod: 'GET',
        middleware: [mainController.index],
        accessLevel: accessLevels.public
    }, {
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
        middleware: [contactController.create],
        accessLevel: accessLevels.public
    }, {
        path: '/api/contacts/feedback',
        httpMethod: 'POST',
        middleware: [contactController.feedback],
        accessLevel: accessLevels.public
    },

    /** api users **/
    {
        path: '/api/users/signup',
        httpMethod: 'POST',
        middleware: [userController.signup],
        accessLevel: accessLevels.public
    }, {
        path: '/api/users/forgotpassword',
        httpMethod: 'POST',
        middleware: [userController.forgotPassword],
        accessLevel: accessLevels.public
    }, {
        path: '/api/users/delete',
        httpMethod: 'DELETE',
        middleware: [raceController.destroyAllRaceOfUser, userController.deleteAccount],
        accessLevel: accessLevels.user
    }, {
        path: '/api/users/update/profile',
        httpMethod: 'PUT',
        middleware: [userController.updateProfile],
        accessLevel: accessLevels.user
    }, {
        path: '/api/users/update/password',
        httpMethod: 'PUT',
        middleware: [userController.updatePassword],
        accessLevel: accessLevels.user
    }, {
        path: '/api/users/check/email',
        httpMethod: 'POST',
        middleware: [userController.checkIfEmailAlreadyExists],
        accessLevel: accessLevels.public
    }, {
        path: '/api/users/logout',
        httpMethod: 'POST',
        middleware: [userController.logout],
        accessLevel: accessLevels.user
    }, {
        path: '/api/users/settings',
        httpMethod: 'GET',
        middleware: [userController.settings],
        accessLevel: accessLevels.user
    }, {
        path: '/api/users/session',
        httpMethod: 'POST',
        middleware: [userController.login],
        accessLevel: accessLevels.public
    },

    /** api races **/

    {
        path: '/api/races/create',
        httpMethod: 'POST',
        middleware: [raceController.create],
        accessLevel: accessLevels.user
    }, {
        path: '/api/races/find/(page/:page)?',
        httpMethod: 'GET',
        middleware: [raceController.findByUser],
        accessLevel: accessLevels.user
    }, {
        path: '/api/races/:raceId',
        httpMethod: 'GET',
        middleware: [raceController.find],
        accessLevel: accessLevels.public
    }, {
        path: '/api/races/:raceId/update',
        httpMethod: 'PUT',
        middleware: [gmaps.geocodeAddress, raceController.update],
        accessLevel: accessLevels.user
    }, {
        path: '/api/races/:raceId/publish/:value',
        httpMethod: 'PUT',
        middleware: [raceController.publish],
        accessLevel: accessLevels.user

    }, {
        path: '/api/races/:raceId/delete',
        httpMethod: 'DELETE',
        middleware: [raceController.delete],
        accessLevel: accessLevels.user
    },
    {
        path: '/api/races/search',
        httpMethod: 'POST',
        middleware: [raceController.extractCriteria, raceController.search, raceController.departmentFacets, raceController.dateFacets, raceController.typeFacets],
        accessLevel: accessLevels.public
    },
    {
        path: '/api/races/autocomplete/:query_string',
        httpMethod: 'GET',
        middleware: [raceController.autocomplete],
        accessLevel: accessLevels.public
    },


    // redirect all others to the index (HTML5 history)
    {
        path: '*',
        httpMethod: 'GET',
        middleware: [mainController.index],
        accessLevel: accessLevels.public
    },
];

module.exports = function(app) {

    app.param(':raceId', raceController.load);

    _.each(routes, function(route) {
        route.middleware.unshift(ensureAuthorized);
        var args = _.flatten([route.path, route.middleware]);

        switch (route.httpMethod.toUpperCase()) {
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
        }
    });
};

var ensureAuthorized = function(req, res, next) {
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
        return res.send(403, {
            message: ['error.accessDenied']
        });
    }
    return next();

};