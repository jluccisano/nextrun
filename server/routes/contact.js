var contactController = require("../controllers/contactController"),
    routerService = require("../middlewares/router"),
    accessLevels = require("../../client/routingConfig").accessLevels;

var routes = [{
    path: "/feedback",
    httpMethod: "POST",
    middleware: [contactController.feedback],
    accessLevel: accessLevels.public
},{
    path: "/:id",
    httpMethod: "GET",
    middleware: [contactController.find],
    accessLevel: accessLevels.admin
}, {
    path: "/new",
    httpMethod: "POST",
    middleware: [contactController.create],
    accessLevel: accessLevels.public
}, {
    path: "/find/page/(:page)?",
    httpMethod: "GET",
    middleware: [contactController.findAll],
    accessLevel: accessLevels.admin
}, {
    path: "/:id/delete",
    httpMethod: "DELETE",
    middleware: [contactController.delete],
    accessLevel: accessLevels.admin
}, {
    path: "/:id/update",
    httpMethod: "PUT",
    middleware: [contactController.update],
    accessLevel: accessLevels.admin
}];

module.exports = function(app, express) {
    var router = express.Router();
    router.param("id", contactController.load);
    routerService.register(app, router, routes, "/api/contacts");
};