var raceController = require("../controllers/raceController"),
    gmaps = require("../../config/middlewares/gmaps"),
    router = require("../../config/middlewares/router"),
    accessLevels = require("../../client/routingConfig").accessLevels;


/** ROUTES **/

var routes = [

    /** api races **/

    {
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
        path: "/find/page/:page",
        httpMethod: "GET",
        middleware: [raceController.findByUser],
        accessLevel: accessLevels.user
    }, {
        path: "/:raceId",
        httpMethod: "GET",
        middleware: [raceController.find],
        accessLevel: accessLevels.public
    }, {
        path: "/:raceId/update",
        httpMethod: "PUT",
        middleware: [gmaps.geocodeAddress, raceController.update],
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
    router.register(app, express, routes, "/api/races");
};