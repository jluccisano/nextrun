var raceController = require("../controllers/raceController"),
    raceController = require("../controllers/raceController"),
    routeController = require("../controllers/routeController"),
    routerService = require("../middlewares/router"),
    accessLevels = require("../../client/routingConfig").accessLevels;

var routes = [{
    path: "/:id",
    httpMethod: "GET",
    middleware: [raceController.getRace],
    accessLevel: accessLevels.public
}, {
    path: "/create",
    httpMethod: "POST",
    middleware: [raceController.createRace],
    accessLevel: accessLevels.user
}, {
    path: "/:id/find/page/(:page)?",
    httpMethod: "GET",
    middleware: [raceController.getRacesByUser],
    accessLevel: accessLevels.user
}, {
    path: "/find/page/(:page)?",
    httpMethod: "GET",
    middleware: [raceController.getRaces],
    accessLevel: accessLevels.admin
}, {
    path: "/:id/update",
    httpMethod: "PUT",
    middleware: [raceController.checkIfRaceNameAlreadyExists, raceController.updateRace],
    accessLevel: accessLevels.user
}, {
    path: "/:id/route/:routeId/update",
    httpMethod: "PUT",
    middleware: [raceController.addRouteRef],
    accessLevel: accessLevels.user
}, {
    path: "/:id/publish",
    httpMethod: "PUT",
    middleware: [raceController.publishRace],
    accessLevel: accessLevels.user

}, {
    path: "/:id/unpublish",
    httpMethod: "PUT",
    middleware: [raceController.unpublishRace],
    accessLevel: accessLevels.user

}, {
    path: "/:id/delete",
    httpMethod: "DELETE",
    middleware: [raceController.deleteRace],
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
    path: "/:id/upload",
    httpMethod: "POST",
    middleware: [raceController.deletePicture, raceController.uploadPicture],
    accessLevel: accessLevels.public
}, {
    path: "/:id/download",
    httpMethod: "POST",
    middleware: [raceController.downloadPicture],
    accessLevel: accessLevels.public
},{
    path: "/:id/name/available",
    httpMethod: "POST",
    middleware: [raceController.checkIfRaceNameAvailable],
    accessLevel: accessLevels.public
}];



module.exports = function(app, express) {
    var router = express.Router();
    router.param("id", raceController.loadRace);
    router.param("routeId", routeController.loadRoute);
    routerService.register(app, router, routes, "/api/races");
};