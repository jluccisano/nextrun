var mainController = require("../controllers/mainController"),
    routerService = require("../middlewares/router"),
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
    },{
        path: "/partials/(:type)?/templates/:name",
        httpMethod: "GET",
        middleware: [mainController.templates],
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

    var router = express.Router();
    routerService.register(app, router, routes, "");
};