var routeController = require("../controllers/routeController"),
    routerService = require("../middlewares/router"),
    accessLevels = require("../../client/routingConfig").accessLevels;


/** ROUTES **/

var routes = [

    /** api routes **/
    {
        path: "/:routeId",
        httpMethod: "GET",
        middleware: [routeController.find],
        accessLevel: accessLevels.public
    }, {
        path: "/new",
        httpMethod: "POST",
        middleware: [routeController.create],
        accessLevel: accessLevels.user
    },{
        path: "/find/page/(:page)?",
        httpMethod: "GET",
        middleware: [routeController.findByUser],
        accessLevel: accessLevels.user
    },{
        path: "/:routeId/delete",
        httpMethod: "DELETE",
        middleware: [routeController.delete],
        accessLevel: accessLevels.user
    },/* {
        path: "/find",
        httpMethod: "GET",
        middleware: [routeController.findByUser],
        accessLevel: accessLevels.user
    }, {
        path: "/find/page/(:page)?",
        httpMethod: "GET",
        middleware: [routeController.findByUser],
        accessLevel: accessLevels.user
    }, {
        path: "/:routeId/update",
        httpMethod: "PUT",
        middleware: [routeController.update],
        accessLevel: accessLevels.user
    }, {
        path: "/:routeId/delete",
        httpMethod: "DELETE",
        middleware: [routeController.delete],
        accessLevel: accessLevels.user
    },*/

];

module.exports = function(app, express) {

    var router = express.Router();

    router.param("routeId", routeController.load);

    routerService.register(app, router, routes, "/api/routes");
};