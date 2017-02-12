var routeController = require("../controllers/routeController"),
    raceController = require("../controllers/raceController"),
    routerService = require("../middlewares/router"),
    authorizationUtils = require("../utils/authorizationUtils"),
    accessLevels = require("../../client/routingConfig").accessLevels;

var routes = [{
    path: "/:id",
    httpMethod: "GET",
    middleware: [authorizationUtils.checkRouteNotPublished, routeController.getRoute],
    accessLevel: accessLevels.public
}, {
    path: "/new",
    httpMethod: "POST",
    middleware: [routeController.createRoute],
    accessLevel: accessLevels.user
}, {
    path: "/:id/find/page/(:page)?",
    httpMethod: "GET",
    middleware: [routeController.getRoutesByUser],
    accessLevel: accessLevels.user
}, {
    path: "/find/page/(:page)?",
    httpMethod: "GET",
    middleware: [routeController.getRoutes],
    accessLevel: accessLevels.admin
}, {
    path: "/:id/delete",
    httpMethod: "DELETE",
    middleware: [raceController.updateRouteRef, routeController.deleteRoute],
    accessLevel: accessLevels.user
}, {
    path: "/:id/update",
    httpMethod: "PUT",
    middleware: [routeController.updateRoute],
    accessLevel: accessLevels.user
}, {
    path: "/:id/publish",
    httpMethod: "PUT",
    middleware: [routeController.publishRoute],
    accessLevel: accessLevels.user

}, {
    path: "/:id/unpublish",
    httpMethod: "PUT",
    middleware: [routeController.unpublishRoute],
    accessLevel: accessLevels.user
}, ];

module.exports = function(app, express) {
    var router = express.Router();
    router.param("id", routeController.loadRoute);
    routerService.register(app, router, routes, "/api/routes");
};