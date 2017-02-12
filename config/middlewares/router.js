'use strict';

/**
 * Module dependencies.
 */

var _                = require('underscore')
,   routingConfig    = require('../../client/configs/routingConfig');
/**
 *  Register every routes
 */

module.exports.register = function(app, express, routes, routerPath) {

  var router = express.Router();

   // TODO: move this to authorization.js
   var ensureAuthorized = function (req, res, next) {
      var role;

      if(!req.user) role = routingConfig.userRoles.public;
      else          role = req.user.role;

      var accessLevel = _.findWhere(routes, { path: req.route.path }).accessLevel || routingConfig.accessLevels.public;
      if(!(accessLevel.bitMask & role.bitMask)) return res.send(403, "access forbidden");

      return next();
  }

  _.each(routes, function(route) {

      route.middleware.unshift(ensureAuthorized);

      switch(route.httpMethod.toUpperCase()) {
          case 'GET':
              router.get(route.path, route.middleware);
              break;
          case 'POST':
              router.post(route.path, route.middleware);
              break;
          case 'PUT':
              router.put(route.path, route.middleware);
              break;
          case 'DELETE':
              router.delete(route.path, route.middleware);
              break;
          default:
              throw new Error('Invalid HTTP method specified for route ' + route.path);
              break;
      }
  });

  app.use(routerPath, router);
}