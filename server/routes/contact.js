var contactController = require("../controllers/contactController"),
    router = require("../../config/middlewares/router"),
    accessLevels = require("../../client/routingConfig").accessLevels;


/** ROUTES **/

var routes = [

    /** api races **/

    /** api contacts **/
    {
        path: "/",
        httpMethod: "POST",
        middleware: [contactController.create],
        accessLevel: accessLevels.public
    }, {
        path: "/feedback",
        httpMethod: "POST",
        middleware: [contactController.feedback],
        accessLevel: accessLevels.public
    },

];

module.exports = function(app, express) {
    router.register(app, express, routes, "/api/contacts");
};