var contactController = require("../controllers/contactController"),
    routerService = require("../middlewares/router"),
    accessLevels = require("../../client/routingConfig").accessLevels;

var routes = [
    {
        path: "/feedback",
        httpMethod: "POST",
        middleware: [contactController.feedback],
        accessLevel: accessLevels.public
    }, {
        path: "/",
        httpMethod: "POST",
        middleware: [contactController.create],
        accessLevel: accessLevels.public
    }
];

module.exports = function(app, express) {
    var router = express.Router();
    routerService.register(app, router, routes, "/api/contacts");
};