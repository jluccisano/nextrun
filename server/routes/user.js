var userController = require("../controllers/userController"),
    raceController = require("../controllers/raceController"),
    router = require("../middlewares/router"),
    accessLevels = require("../../client/routingConfig").accessLevels;


/** ROUTES **/

var routes = [

    /** api users **/
    {
        path: "/signup",
        httpMethod: "POST",
        middleware: [userController.signup],
        accessLevel: accessLevels.public
    }, {
        path: "/forgotpassword",
        httpMethod: "POST",
        middleware: [userController.forgotPassword],
        accessLevel: accessLevels.public
    }, {
        path: "/delete",
        httpMethod: "DELETE",
        middleware: [raceController.destroyAllRaceOfUser, userController.deleteAccount],
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
        path: "/check/email",
        httpMethod: "POST",
        middleware: [userController.checkIfEmailAlreadyExists],
        accessLevel: accessLevels.public
    }, {
        path: "/logout",
        httpMethod: "POST",
        middleware: [userController.logout],
        accessLevel: accessLevels.user
    }, {
        path: "/settings",
        httpMethod: "GET",
        middleware: [userController.settings],
        accessLevel: accessLevels.user
    }, {
        path: "/session",
        httpMethod: "POST",
        middleware: [userController.login],
        accessLevel: accessLevels.public
    },

];

module.exports = function(app, express) {
    router.register(app, express, routes, "/api/users");
};