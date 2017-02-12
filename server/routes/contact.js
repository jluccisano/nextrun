var contactController = require("../controllers/contactController"),
    router = require("../middlewares/router"),
    accessLevels = require("../../client/routingConfig").accessLevels;


/** ROUTES **/

var routes = [

    /** api races **/

    /** api contacts **/
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
    router.register(app, express, routes, "/api/contacts");
};