var routeController = require("../controllers/routeController"),
    raceController = require("../controllers/raceController"),
    routerService = require("../middlewares/router"),
    accessLevels = require("../../client/routingConfig").accessLevels;
    
var routes = [
    {
        path: "/:id",
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
        path: "/:id/delete",
        httpMethod: "DELETE",
        middleware: [raceController.updateRoutesRef, routeController.delete],
        accessLevel: accessLevels.user
    },{
        path: "/:id/update",
        httpMethod: "PUT",
        middleware: [routeController.update],
        accessLevel: accessLevels.user
    }
];

module.exports = function(app, express) {
    var router = express.Router();
    router.param("id", routeController.load);
    routerService.register(app, router, routes, "/api/routes");
};