var mainController = require("../controllers/mainController"),
    router = require("../../config/middlewares/router"),
    accessLevels = require("../../client/routingConfig").accessLevels;


/** ROUTES **/

var routes = [

    // Views

    {
        path: "/",
        httpMethod: "GET",
        middleware: [mainController.index],
        accessLevel: accessLevels.public
    }, {
        path: "/partials/(:type)?/:name",
        httpMethod: "GET",
        middleware: [mainController.partials],
        accessLevel: accessLevels.public
    },

    // redirect all others to the index (HTML5 history)
    {
        path: "*",
        httpMethod: "GET",
        middleware: [mainController.index],
        accessLevel: accessLevels.public
    }

];

module.exports = function(app, express) {
    router.register(app, express, routes, "");
};