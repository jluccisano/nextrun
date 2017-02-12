var raceController = require("../controllers/raceController"),
    routeController = require("../controllers/routeController"),
    routerService = require("../middlewares/router"),
    accessLevels = require("../../client/routingConfig").accessLevels;

var routes = [
    {
        path: "/:id",
        httpMethod: "GET",
        middleware: [raceController.find],
        accessLevel: accessLevels.public
    }, {
        path: "/create",
        httpMethod: "POST",
        middleware: [raceController.create],
        accessLevel: accessLevels.user
    }, {
        path: "/find",
        httpMethod: "GET",
        middleware: [raceController.findByUser],
        accessLevel: accessLevels.user
    }, {
        path: "/find/page/(:page)?",
        httpMethod: "GET",
        middleware: [raceController.findByUser],
        accessLevel: accessLevels.user
    }, {
        path: "/:id/update",
        httpMethod: "PUT",
        middleware: [raceController.update],
        accessLevel: accessLevels.user
    },{
        path: "/:id/route/:routeId/update",
        httpMethod: "PUT",
        middleware: [raceController.updateRoute],
        accessLevel: accessLevels.user
    }, {
        path: "/:id/publish/:value",
        httpMethod: "PUT",
        middleware: [raceController.publish],
        accessLevel: accessLevels.user

    }, {
        path: "/:id/delete",
        httpMethod: "DELETE",
        middleware: [raceController.delete],
        accessLevel: accessLevels.user
    }, {
        path: "/search",
        httpMethod: "POST",
        middleware: [raceController.search],
        accessLevel: accessLevels.public
    }, {
        path: "/autocomplete",
        httpMethod: "POST",
        middleware: [raceController.autocomplete],
        accessLevel: accessLevels.public
    }, {
        path: "/",
        httpMethod: "GET",
        middleware: [raceController.findAll],
        accessLevel: accessLevels.public
    }
];

module.exports = function(app, express) {
    var router = express.Router();
    router.param("id", raceController.load);
    router.param("routeId", routeController.load);
    routerService.register(app, router, routes, "/api/races");
};