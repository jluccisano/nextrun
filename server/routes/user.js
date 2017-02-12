var userController = require("../controllers/userController"),
    raceController = require("../controllers/raceController"),
    routerService = require("../middlewares/router"),
    accessLevels = require("../../client/routingConfig").accessLevels;

var routes = [{
    path: "/signup",
    httpMethod: "POST",
    middleware: [userController.signup],
    accessLevel: accessLevels.public
}, {
    path: "/logout",
    httpMethod: "POST",
    middleware: [userController.logout],
    accessLevel: accessLevels.user
}, {
    path: "/session",
    httpMethod: "POST",
    middleware: [userController.session],
    accessLevel: accessLevels.public
}, {
    path: "/forgotpassword",
    httpMethod: "POST",
    middleware: [userController.getUserByEmail, userController.generateNewPassword],
    accessLevel: accessLevels.public
}, {
    path: "/settings",
    httpMethod: "GET",
    middleware: [userController.settings],
    accessLevel: accessLevels.user
}, {
    path: "/update/profile",
    httpMethod: "PUT",
    middleware: [userController.updateProfile],
    accessLevel: accessLevels.user
}, {
    path: "/update/password",
    httpMethod: "PUT",
    middleware: [userController.updatePassword],
    accessLevel: accessLevels.user
}, {
    path: "/delete",
    httpMethod: "DELETE",
    middleware: [raceController.deleteRacesOfUser, userController.deleteAccount],
    accessLevel: accessLevels.user
}, {
    path: "/find/page/(:page)?",
    httpMethod: "GET",
    middleware: [userController.getUsers],
    accessLevel: accessLevels.admin
}, {
    path: "/:id",
    httpMethod: "GET",
    middleware: [userController.getUser],
    accessLevel: accessLevels.admin
}, {
    path: "/:id/name/available",
    httpMethod: "POST",
    middleware: [userController.checkIfUserNameAvailable],
    accessLevel: accessLevels.public
}];

module.exports = function(app, express) {
    var router = express.Router();
    router.param("id", userController.loadUser);
    routerService.register(app, router, routes, "/api/users");
};