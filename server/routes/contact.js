var contactController = require("../controllers/contactController"),
    routerService = require("../middlewares/router"),
    accessLevels = require("../../client/routingConfig").accessLevels;

var routes = [{
    path: "/feedback",
    httpMethod: "POST",
    middleware: [contactController.sendFeedback],
    accessLevel: accessLevels.public
},{
    path: "/:id",
    httpMethod: "GET",
    middleware: [contactController.getContact],
    accessLevel: accessLevels.admin
}, {
    path: "/new",
    httpMethod: "POST",
    middleware: [contactController.createContact],
    accessLevel: accessLevels.public
}, {
    path: "/find/page/(:page)?",
    httpMethod: "GET",
    middleware: [contactController.getContacts],
    accessLevel: accessLevels.admin
}, {
    path: "/:id/delete",
    httpMethod: "DELETE",
    middleware: [contactController.deleteContact],
    accessLevel: accessLevels.admin
}, {
    path: "/:id/update",
    httpMethod: "PUT",
    middleware: [contactController.updateContact],
    accessLevel: accessLevels.admin
}];

module.exports = function(app, express) {
    var router = express.Router();
    router.param("id", contactController.loadContact);
    routerService.register(app, router, routes, "/api/contacts");
};