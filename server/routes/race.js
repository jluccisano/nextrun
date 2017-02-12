var raceController = require("../controllers/raceController"),
    routerService = require("../middlewares/router"),
    accessLevels = require("../../client/routingConfig").accessLevels;


/** ROUTES **/

var routes = [

    /** api races **/
    {
        path: "/:raceId",
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
        path: "/:raceId/update",
        httpMethod: "PUT",
        middleware: [raceController.updateField],
        accessLevel: accessLevels.user
    }, {
        path: "/:raceId/publish/:value",
        httpMethod: "PUT",
        middleware: [raceController.publish],
        accessLevel: accessLevels.user

    }, {
        path: "/:raceId/delete",
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
    },

];

module.exports = function(app, express) {

    var router = express.Router();

    router.param("raceId", raceController.load);

    routerService.register(app, router, routes, "/api/races");
};